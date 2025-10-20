/**
 * 数据库备份管理工具
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const config = require('../../config/database');
const logger = require('./logger');

const execPromise = promisify(exec);

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '../../backups');
    this.maxBackups = 10; // 最多保留10个备份
  }

  /**
   * 创建数据库备份
   * @param {string} backupName - 备份名称
   * @returns {Promise<Object>} 备份结果
   */
  async createBackup(backupName = null) {
    try {
      // 确保备份目录存在
      await fs.mkdir(this.backupDir, { recursive: true });
      
      // 生成备份文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = backupName || `backup-${timestamp}.sql`;
      const backupPath = path.join(this.backupDir, filename);
      
      // 构建mysqldump命令
      const { mysql } = config;
      const dumpCommand = `mysqldump -h ${mysql.host} -P ${mysql.port} -u ${mysql.user} -p${mysql.password} ${mysql.database} > "${backupPath}"`;
      
      // 执行备份命令
      await execPromise(dumpCommand);
      
      // 记录日志
      logger.info('数据库备份创建成功', {
        backupPath,
        timestamp: new Date().toISOString()
      });
      
      // 清理旧备份
      await this.cleanupOldBackups();
      
      return {
        success: true,
        backupPath,
        filename,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('数据库备份创建失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 恢复数据库备份
   * @param {string} backupFilename - 备份文件名
   * @returns {Promise<Object>} 恢复结果
   */
  async restoreBackup(backupFilename) {
    try {
      const backupPath = path.join(this.backupDir, backupFilename);
      
      // 检查备份文件是否存在
      try {
        await fs.access(backupPath);
      } catch (error) {
        throw new Error(`备份文件不存在: ${backupPath}`);
      }
      
      // 构建mysql命令
      const { mysql } = config;
      const restoreCommand = `mysql -h ${mysql.host} -P ${mysql.port} -u ${mysql.user} -p${mysql.password} ${mysql.database} < "${backupPath}"`;
      
      // 执行恢复命令
      await execPromise(restoreCommand);
      
      // 记录日志
      logger.info('数据库备份恢复成功', {
        backupPath,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        message: '数据库恢复成功',
        backupPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('数据库备份恢复失败', {
        message: error.message,
        stack: error.stack,
        backupFilename
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取备份列表
   * @returns {Promise<Array>} 备份文件列表
   */
  async getBackupList() {
    try {
      // 确保备份目录存在
      await fs.mkdir(this.backupDir, { recursive: true });
      
      // 读取备份目录
      const files = await fs.readdir(this.backupDir);
      
      // 过滤出.sql文件并获取详细信息
      const backups = [];
      for (const file of files) {
        if (file.endsWith('.sql')) {
          const filePath = path.join(this.backupDir, file);
          const stats = await fs.stat(filePath);
          backups.push({
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });
        }
      }
      
      // 按创建时间排序
      backups.sort((a, b) => b.created - a.created);
      
      return backups;
    } catch (error) {
      logger.error('获取备份列表失败', {
        message: error.message,
        stack: error.stack
      });
      
      return [];
    }
  }

  /**
   * 删除备份文件
   * @param {string} backupFilename - 备份文件名
   * @returns {Promise<Object>} 删除结果
   */
  async deleteBackup(backupFilename) {
    try {
      const backupPath = path.join(this.backupDir, backupFilename);
      
      // 检查备份文件是否存在
      try {
        await fs.access(backupPath);
      } catch (error) {
        throw new Error(`备份文件不存在: ${backupPath}`);
      }
      
      // 删除备份文件
      await fs.unlink(backupPath);
      
      // 记录日志
      logger.info('数据库备份文件删除成功', {
        backupPath,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        message: '备份文件删除成功'
      };
    } catch (error) {
      logger.error('数据库备份文件删除失败', {
        message: error.message,
        stack: error.stack,
        backupFilename
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 清理旧备份文件
   * @returns {Promise<Object>} 清理结果
   */
  async cleanupOldBackups() {
    try {
      const backups = await this.getBackupList();
      
      // 如果备份数量超过最大限制，删除最旧的备份
      if (backups.length > this.maxBackups) {
        const backupsToDelete = backups.slice(this.maxBackups);
        const deletedCount = 0;
        
        for (const backup of backupsToDelete) {
          try {
            await this.deleteBackup(backup.filename);
            deletedCount++;
          } catch (error) {
            logger.warn('删除旧备份文件失败', {
              message: error.message,
              filename: backup.filename
            });
          }
        }
        
        logger.info('旧备份文件清理完成', {
          deletedCount,
          remainingCount: backups.length - deletedCount
        });
        
        return {
          success: true,
          deletedCount,
          remainingCount: backups.length - deletedCount
        };
      }
      
      return {
        success: true,
        deletedCount: 0,
        remainingCount: backups.length
      };
    } catch (error) {
      logger.error('清理旧备份文件失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 自动备份（定时任务）
   * @returns {Promise<Object>} 备份结果
   */
  async autoBackup() {
    try {
      const backupName = `auto-backup-${new Date().toISOString().slice(0, 10)}.sql`;
      const result = await this.createBackup(backupName);
      
      if (result.success) {
        logger.info('自动数据库备份完成', {
          backupPath: result.backupPath,
          timestamp: result.timestamp
        });
      } else {
        logger.error('自动数据库备份失败', {
          error: result.error
        });
      }
      
      return result;
    } catch (error) {
      logger.error('自动数据库备份异常', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = DatabaseBackup;