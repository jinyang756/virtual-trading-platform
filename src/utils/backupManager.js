const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const config = require('../../config');
const DataManager = require('./dataManager');

class BackupManager {
  // 创建完整备份
  static async createFullBackup() {
    try {
      console.log('开始创建完整备份...');
      
      // 创建备份时间戳
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(config.backupPath, `backup_${timestamp}`);
      
      // 确保备份目录存在
      await fs.mkdir(backupDir, { recursive: true });
      
      // 备份数据目录
      await this.backupDirectory(config.dataPath, backupDir);
      
      // 如果使用数据库，也备份数据库
      if (process.env.DATABASE_TYPE === 'mysql') {
        await this.backupMySQLDatabase(backupDir);
      }
      
      console.log(`完整备份创建成功: ${backupDir}`);
      return backupDir;
    } catch (error) {
      throw new Error(`创建完整备份失败: ${error.message}`);
    }
  }

  // 备份目录
  static async backupDirectory(sourceDir, destDir) {
    try {
      const files = await fs.readdir(sourceDir);
      
      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        
        const stats = await fs.stat(sourcePath);
        
        if (stats.isDirectory()) {
          // 递归备份子目录
          await fs.mkdir(destPath, { recursive: true });
          await this.backupDirectory(sourcePath, destPath);
        } else {
          // 复制文件
          await fs.copyFile(sourcePath, destPath);
        }
      }
    } catch (error) {
      throw new Error(`备份目录失败: ${error.message}`);
    }
  }

  // 备份MySQL数据库
  static async backupMySQLDatabase(backupDir) {
    try {
      const dbConfig = require('../../config/database').mysql;
      const backupFile = path.join(backupDir, 'database_backup.sql');
      
      // 使用mysqldump命令备份数据库
      const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupFile}`;
      
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`数据库备份失败: ${error.message}`));
          } else {
            resolve();
          }
        });
      });
      
      console.log('MySQL数据库备份完成');
    } catch (error) {
      console.warn('MySQL数据库备份失败:', error.message);
    }
  }

  // 恢复完整备份
  static async restoreFullBackup(backupDir) {
    try {
      console.log(`开始恢复备份: ${backupDir}`);
      
      // 检查备份目录是否存在
      await fs.access(backupDir);
      
      // 恢复数据目录
      await this.restoreDirectory(backupDir, config.dataPath);
      
      // 如果存在数据库备份，也恢复数据库
      const dbBackupFile = path.join(backupDir, 'database_backup.sql');
      try {
        await fs.access(dbBackupFile);
        await this.restoreMySQLDatabase(dbBackupFile);
      } catch (error) {
        // 数据库备份文件不存在，跳过
      }
      
      console.log('完整备份恢复成功');
    } catch (error) {
      throw new Error(`恢复完整备份失败: ${error.message}`);
    }
  }

  // 恢复目录
  static async restoreDirectory(sourceDir, destDir) {
    try {
      const files = await fs.readdir(sourceDir);
      
      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        
        const stats = await fs.stat(sourcePath);
        
        if (stats.isDirectory()) {
          // 递归恢复子目录
          await fs.mkdir(destPath, { recursive: true });
          await this.restoreDirectory(sourcePath, destPath);
        } else {
          // 复制文件
          await fs.copyFile(sourcePath, destPath);
        }
      }
    } catch (error) {
      throw new Error(`恢复目录失败: ${error.message}`);
    }
  }

  // 恢复MySQL数据库
  static async restoreMySQLDatabase(backupFile) {
    try {
      const dbConfig = require('../../config/database').mysql;
      
      // 使用mysql命令恢复数据库
      const command = `mysql -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < ${backupFile}`;
      
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`数据库恢复失败: ${error.message}`));
          } else {
            resolve();
          }
        });
      });
      
      console.log('MySQL数据库恢复完成');
    } catch (error) {
      console.warn('MySQL数据库恢复失败:', error.message);
    }
  }

  // 列出所有备份
  static async listBackups() {
    try {
      const files = await fs.readdir(config.backupPath);
      const backups = [];
      
      for (const file of files) {
        const filePath = path.join(config.backupPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory() && file.startsWith('backup_')) {
          backups.push({
            name: file,
            path: filePath,
            size: stats.size,
            created: stats.mtime
          });
        }
      }
      
      // 按创建时间排序
      backups.sort((a, b) => b.created - a.created);
      
      return backups;
    } catch (error) {
      throw new Error(`列出备份失败: ${error.message}`);
    }
  }

  // 删除备份
  static async deleteBackup(backupName) {
    try {
      const backupPath = path.join(config.backupPath, backupName);
      await fs.rm(backupPath, { recursive: true, force: true });
      console.log(`备份已删除: ${backupName}`);
    } catch (error) {
      throw new Error(`删除备份失败: ${error.message}`);
    }
  }

  // 清理旧备份
  static async cleanupOldBackups(keepDays = 30) {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - keepDays);
      
      for (const backup of backups) {
        if (backup.created < cutoffDate) {
          await this.deleteBackup(backup.name);
        }
      }
      
      console.log(`已清理 ${keepDays} 天前的旧备份`);
    } catch (error) {
      throw new Error(`清理旧备份失败: ${error.message}`);
    }
  }
}

module.exports = BackupManager;
