#!/usr/bin/env node

const BackupManager = require('../src/utils/backupManager');

// 创建完整备份
async function backupAllData() {
  try {
    console.log('开始创建完整备份...');
    
    const backupDir = await BackupManager.createFullBackup();
    console.log(`完整备份创建成功: ${backupDir}`);
    
    // 清理7天前的旧备份
    await BackupManager.cleanupOldBackups(7);
    
    console.log('备份完成!');
  } catch (error) {
    console.error('备份过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 列出所有备份
async function listBackups() {
  try {
    console.log('列出所有备份:');
    const backups = await BackupManager.listBackups();
    
    if (backups.length === 0) {
      console.log('没有找到备份');
      return;
    }
    
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.name}`);
      console.log(`   路径: ${backup.path}`);
      console.log(`   创建时间: ${backup.created}`);
      console.log();
    });
  } catch (error) {
    console.error('列出备份时发生错误:', error.message);
    process.exit(1);
  }
}

// 恢复备份
async function restoreBackup(backupName) {
  try {
    console.log(`开始恢复备份: ${backupName}`);
    
    const backupPath = `backup_${backupName}`;
    await BackupManager.restoreFullBackup(backupPath);
    
    console.log('备份恢复完成!');
  } catch (error) {
    console.error('恢复备份时发生错误:', error.message);
    process.exit(1);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 默认创建备份
    await backupAllData();
  } else if (args[0] === 'list') {
    // 列出备份
    await listBackups();
  } else if (args[0] === 'restore' && args[1]) {
    // 恢复备份
    await restoreBackup(args[1]);
  } else {
    console.log('用法:');
    console.log('  node backup.js          # 创建备份');
    console.log('  node backup.js list     # 列出备份');
    console.log('  node backup.js restore <backup_name>  # 恢复备份');
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  backupAllData
};