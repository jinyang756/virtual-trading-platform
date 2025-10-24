const fs = require('fs');
const path = require('path');
const winston = require('winston');
const alertManager = require('../utils/alertManager');

// 创建前端性能日志记录器
const frontendPerformanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/frontend-performance.log' })
  ]
});

// 创建用户交互日志记录器
const userInteractionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/user-interaction.log' })
  ]
});

class PerformanceController {
  /**
   * 接收并记录前端性能数据
   */
  static async recordFrontendPerformance(req, res) {
    try {
      const perfData = req.body;
      
      // 记录性能数据
      frontendPerformanceLogger.info('Frontend performance data received', perfData);
      
      // 如果页面加载时间超过阈值，记录警告并触发告警
      if (perfData.loadEventEnd && perfData.loadEventEnd > 5000) { // 5秒阈值
        frontendPerformanceLogger.warn('Slow page load detected', {
          url: perfData.url,
          loadTime: perfData.loadEventEnd,
          threshold: 5000
        });
        
        // 触发告警
        alertManager.checkPageLoadTime(perfData.loadEventEnd, perfData.url);
      }
      
      res.json({ 
        success: true, 
        message: 'Performance data recorded successfully' 
      });
    } catch (error) {
      console.error('Error recording frontend performance:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to record performance data' 
      });
    }
  }

  /**
   * 接收并记录用户交互性能数据
   */
  static async recordUserInteraction(req, res) {
    try {
      const interactionData = req.body;
      
      // 记录用户交互数据
      userInteractionLogger.info('User interaction data received', interactionData);
      
      // 如果交互响应时间超过阈值，记录警告
      if (interactionData.duration && interactionData.duration > 1000) { // 1秒阈值
        userInteractionLogger.warn('Slow user interaction detected', {
          action: interactionData.action,
          duration: interactionData.duration,
          threshold: 1000
        });
      }
      
      res.json({ 
        success: true, 
        message: 'User interaction data recorded successfully' 
      });
    } catch (error) {
      console.error('Error recording user interaction:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to record user interaction data' 
      });
    }
  }

  /**
   * 获取前端性能报告
   */
  static async getFrontendPerformanceReport(req, res) {
    try {
      // 读取性能日志文件并生成报告
      const logFilePath = path.join(process.cwd(), 'logs', 'frontend-performance.log');
      
      if (!fs.existsSync(logFilePath)) {
        return res.json({ 
          success: true, 
          data: [],
          message: 'No performance data available' 
        });
      }
      
      // 读取日志文件内容
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 解析日志数据
      const performanceData = [];
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          performanceData.push(logEntry);
        } catch (parseError) {
          // 忽略解析错误的行
          continue;
        }
      }
      
      res.json({ 
        success: true, 
        data: performanceData,
        message: 'Performance report generated successfully' 
      });
    } catch (error) {
      console.error('Error generating performance report:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate performance report' 
      });
    }
  }

  /**
   * 获取用户交互性能报告
   */
  static async getUserInteractionReport(req, res) {
    try {
      // 读取用户交互日志文件并生成报告
      const logFilePath = path.join(process.cwd(), 'logs', 'user-interaction.log');
      
      if (!fs.existsSync(logFilePath)) {
        return res.json({ 
          success: true, 
          data: [],
          message: 'No user interaction data available' 
        });
      }
      
      // 读取日志文件内容
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 解析日志数据
      const interactionData = [];
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          interactionData.push(logEntry);
        } catch (parseError) {
          // 忽略解析错误的行
          continue;
        }
      }
      
      res.json({ 
        success: true, 
        data: interactionData,
        message: 'User interaction report generated successfully' 
      });
    } catch (error) {
      console.error('Error generating user interaction report:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate user interaction report' 
      });
    }
  }
}

module.exports = PerformanceController;