const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

class Logger {
  constructor() {
    this.logPath = path.join(__dirname, '../../logs');
  }

  // 记录信息日志
  async info(message, data = null) {
    await this.log('INFO', message, data);
  }

  // 记录错误日志
  async error(message, data = null) {
    await this.log('ERROR', message, data);
  }

  // 记录警告日志
  async warn(message, data = null) {
    await this.log('WARN', message, data);
  }

  // 记录调试日志
  async debug(message, data = null) {
    await this.log('DEBUG', message, data);
  }

  // 通用日志记录方法
  async log(level, message, data = null) {
    try {
      // 确保日志目录存在
      await fs.mkdir(this.logPath, { recursive: true });
      
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        data
      };
      
      const logFileName = `app_${new Date().toISOString().split('T')[0]}.log`;
      const logFilePath = path.join(this.logPath, logFileName);
      
      // 追加到日志文件
      await fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n');
      
      // 同时输出到控制台（仅错误和警告）
      if (level === 'ERROR' || level === 'WARN') {
        console.log(`[${timestamp}] ${level}: ${message}`, data ? data : '');
      }
    } catch (error) {
      // 如果日志记录失败，至少输出到控制台
      console.error(`日志记录失败: ${error.message}`);
    }
  }

  // 获取日志文件列表
  async getLogFiles() {
    try {
      await fs.mkdir(this.logPath, { recursive: true });
      const files = await fs.readdir(this.logPath);
      return files.filter(file => file.endsWith('.log'));
    } catch (error) {
      throw new Error(`获取日志文件列表失败: ${error.message}`);
    }
  }

  // 读取日志文件内容
  async readLogFile(fileName) {
    try {
      const filePath = path.join(this.logPath, fileName);
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`读取日志文件失败: ${error.message}`);
    }
  }
}

module.exports = new Logger();