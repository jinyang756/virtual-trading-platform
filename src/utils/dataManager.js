const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

class DataManager {
  // 备份数据文件
  static async backupDataFile(fileName) {
    try {
      const sourcePath = path.join(config.dataPath, fileName);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `${fileName.replace('.json', '')}_backup_${timestamp}.json`;
      const destinationPath = path.join(config.backupPath, backupFileName);
      
      // 确保备份目录存在
      await fs.mkdir(config.backupPath, { recursive: true });
      
      // 复制文件
      await fs.copyFile(sourcePath, destinationPath);
      
      return backupFileName;
    } catch (error) {
      throw new Error(`备份数据文件失败: ${error.message}`);
    }
  }

  // 恢复数据文件
  static async restoreDataFile(backupFileName) {
    try {
      const backupPath = path.join(config.backupPath, backupFileName);
      const fileName = backupFileName.replace(/_backup_.*/, '.json');
      const destinationPath = path.join(config.dataPath, fileName);
      
      // 复制文件
      await fs.copyFile(backupPath, destinationPath);
      
      return fileName;
    } catch (error) {
      throw new Error(`恢复数据文件失败: ${error.message}`);
    }
  }

  // 清理旧备份文件
  static async cleanupOldBackups(keepDays = 30) {
    try {
      const files = await fs.readdir(config.backupPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - keepDays);
      
      for (const file of files) {
        const filePath = path.join(config.backupPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      throw new Error(`清理旧备份文件失败: ${error.message}`);
    }
  }

  // 导出数据
  static async exportData(fileName) {
    try {
      const filePath = path.join(config.dataPath, fileName);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`导出数据失败: ${error.message}`);
    }
  }

  // 导入数据
  static async importData(fileName, data) {
    try {
      const filePath = path.join(config.dataPath, fileName);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`导入数据失败: ${error.message}`);
    }
  }
}

module.exports = DataManager;