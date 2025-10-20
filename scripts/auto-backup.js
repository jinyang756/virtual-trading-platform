#!/usr/bin/env node

/**
 * 自动化备份脚本
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const BackupManager = require('../src/utils/backupManager');

// 执行命令的函数
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// 创建完整备份
async function createFullBackup() {
  try {
    console.log('开始创建完整备份...');
    
    // 使用现有的备份管理器
    const backupDir = await BackupManager.createFullBackup();
    console.log(`完整备份创建成功: ${backupDir}`);
    
    return backupDir;
  } catch (error) {
    throw new Error(`创建完整备份失败: ${error.message}`);
  }
}

// 创建数据库备份
async function createDatabaseBackup() {
  try {
    console.log('开始创建数据库备份...');
    
    // 创建备份时间戳
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(process.cwd(), 'backups', `database_backup_${timestamp}.sql`);
    
    // 确保备份目录存在
    await fs.mkdir(path.join(process.cwd(), 'backups'), { recursive: true });
    
    // 获取数据库配置
    const dbConfig = require('../config/database').mysql;
    
    // 使用mysqldump命令备份数据库
    const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupFile}`;
    
    await executeCommand(command);
    console.log(`数据库备份创建成功: ${backupFile}`);
    
    return backupFile;
  } catch (error) {
    throw new Error(`创建数据库备份失败: ${error.message}`);
  }
}

// 创建应用数据备份
async function createAppDataBackup() {
  try {
    console.log('开始创建应用数据备份...');
    
    // 创建备份时间戳
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', `app_data_backup_${timestamp}`);
    
    // 确保备份目录存在
    await fs.mkdir(backupDir, { recursive: true });
    
    // 备份数据目录
    const dataDir = path.join(process.cwd(), 'data');
    await BackupManager.backupDirectory(dataDir, backupDir);
    
    console.log(`应用数据备份创建成功: ${backupDir}`);
    
    return backupDir;
  } catch (error) {
    throw new Error(`创建应用数据备份失败: ${error.message}`);
  }
}

// 清理旧备份
async function cleanupOldBackups(keepDays = 7) {
  try {
    console.log(`开始清理${keepDays}天前的旧备份...`);
    
    await BackupManager.cleanupOldBackups(keepDays);
    
    console.log('旧备份清理完成');
  } catch (error) {
    throw new Error(`清理旧备份失败: ${error.message}`);
  }
}

// 上传备份到云存储（示例实现）
async function uploadToCloudStorage(backupPath) {
  try {
    console.log(`开始上传备份到云存储: ${backupPath}`);
    
    // 这里可以实现上传到AWS S3、阿里云OSS等云存储服务
    // 示例代码：
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3();
    // await s3.upload({
    //   Bucket: 'your-backup-bucket',
    //   Key: path.basename(backupPath),
    //   Body: fs.createReadStream(backupPath)
    // }).promise();
    
    console.log('备份上传完成');
  } catch (error) {
    throw new Error(`上传备份到云存储失败: ${error.message}`);
  }
}

// 验证备份完整性
async function verifyBackup(backupPath) {
  try {
    console.log(`验证备份完整性: ${backupPath}`);
    
    // 检查备份文件是否存在
    await fs.access(backupPath);
    
    // 检查备份文件大小
    const stats = await fs.stat(backupPath);
    if (stats.size === 0) {
      throw new Error('备份文件为空');
    }
    
    console.log('备份完整性验证通过');
    return true;
  } catch (error) {
    throw new Error(`备份完整性验证失败: ${error.message}`);
  }
}

// 主备份函数
async function backup() {
  try {
    console.log('=== 开始自动化备份 ===');
    
    // 创建完整备份
    const fullBackupPath = await createFullBackup();
    
    // 验证备份完整性
    await verifyBackup(fullBackupPath);
    
    // 上传到云存储（可选）
    // await uploadToCloudStorage(fullBackupPath);
    
    // 清理7天前的旧备份
    await cleanupOldBackups(7);
    
    console.log('=== 自动化备份完成 ===');
    
    return fullBackupPath;
  } catch (error) {
    console.error('备份失败:', error.message);
    process.exit(1);
  }
}

// 定时备份
function scheduleBackup(intervalHours = 24) {
  console.log(`设置定时备份，间隔: ${intervalHours}小时`);
  
  // 立即执行一次
  backup();
  
  // 定时执行
  setInterval(backup, intervalHours * 60 * 60 * 1000);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--schedule')) {
    const interval = args[1] ? parseInt(args[1]) : 24;
    scheduleBackup(interval);
  } else if (args.includes('--database-only')) {
    await createDatabaseBackup();
  } else if (args.includes('--app-data-only')) {
    await createAppDataBackup();
  } else if (args.includes('--cleanup')) {
    const keepDays = args[1] ? parseInt(args[1]) : 7;
    await cleanupOldBackups(keepDays);
  } else {
    await backup();
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  backup,
  createDatabaseBackup,
  createAppDataBackup,
  cleanupOldBackups,
  scheduleBackup
};