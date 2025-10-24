const fs = require('fs');
const path = require('path');
const winston = require('winston');

class MonitoringController {
  /**
   * 获取系统性能概览数据
   */
  static async getSystemOverview(req, res) {
    try {
      // 模拟系统性能数据
      const overviewData = {
        avgResponseTime: 128,
        dbQueryTime: 42,
        pageLoadTime: 856,
        errorRate: 0.2,
        timestamp: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        data: overviewData,
        message: 'System overview data retrieved successfully' 
      });
    } catch (error) {
      console.error('Error getting system overview:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve system overview data' 
      });
    }
  }

  /**
   * 获取API性能数据
   */
  static async getApiPerformance(req, res) {
    try {
      // 读取API性能日志文件
      const logFilePath = path.join(process.cwd(), 'logs', 'performance.log');
      
      if (!fs.existsSync(logFilePath)) {
        return res.json({ 
          success: true, 
          data: [],
          message: 'No API performance data available' 
        });
      }
      
      // 读取日志文件内容
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 解析日志数据并统计
      const apiStats = {};
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          if (logEntry.message === 'info') {
            const key = `${logEntry.method} ${logEntry.url}`;
            if (!apiStats[key]) {
              apiStats[key] = {
                endpoint: key,
                totalRequests: 0,
                totalTime: 0,
                errors: 0,
                avgTime: 0
              };
            }
            
            apiStats[key].totalRequests++;
            apiStats[key].totalTime += logEntry.duration;
            
            if (logEntry.statusCode >= 400) {
              apiStats[key].errors++;
            }
          }
        } catch (parseError) {
          // 忽略解析错误的行
          continue;
        }
      }
      
      // 计算平均时间
      Object.values(apiStats).forEach(stat => {
        if (stat.totalRequests > 0) {
          stat.avgTime = Math.round(stat.totalTime / stat.totalRequests);
          stat.errorRate = ((stat.errors / stat.totalRequests) * 100).toFixed(1);
        }
      });
      
      res.json({ 
        success: true, 
        data: Object.values(apiStats),
        message: 'API performance data retrieved successfully' 
      });
    } catch (error) {
      console.error('Error getting API performance data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve API performance data' 
      });
    }
  }

  /**
   * 获取数据库性能数据
   */
  static async getDatabasePerformance(req, res) {
    try {
      // 读取数据库性能日志文件
      const logFilePath = path.join(process.cwd(), 'logs', 'db-performance.log');
      
      if (!fs.existsSync(logFilePath)) {
        return res.json({ 
          success: true, 
          data: [],
          message: 'No database performance data available' 
        });
      }
      
      // 读取日志文件内容
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 解析日志数据并统计
      const dbStats = {};
      let slowQueries = 0;
      
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          if (logEntry.message === 'info' || logEntry.message === 'warn') {
            const queryType = logEntry.query.split(' ')[0]; // 使用查询的第一个单词作为类型
            if (!dbStats[queryType]) {
              dbStats[queryType] = {
                queryType: queryType,
                totalQueries: 0,
                totalTime: 0,
                avgTime: 0
              };
            }
            
            dbStats[queryType].totalQueries++;
            dbStats[queryType].totalTime += logEntry.duration;
            
            if (logEntry.message === 'warn') {
              slowQueries++;
            }
          }
        } catch (parseError) {
          // 忽略解析错误的行
          continue;
        }
      }
      
      // 计算平均时间
      Object.values(dbStats).forEach(stat => {
        if (stat.totalQueries > 0) {
          stat.avgTime = Math.round(stat.totalTime / stat.totalQueries);
        }
      });
      
      res.json({ 
        success: true, 
        data: {
          stats: Object.values(dbStats),
          slowQueries: slowQueries
        },
        message: 'Database performance data retrieved successfully' 
      });
    } catch (error) {
      console.error('Error getting database performance data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve database performance data' 
      });
    }
  }

  /**
   * 获取前端性能数据
   */
  static async getFrontendPerformance(req, res) {
    try {
      // 读取前端性能日志文件
      const logFilePath = path.join(process.cwd(), 'logs', 'frontend-performance.log');
      
      if (!fs.existsSync(logFilePath)) {
        return res.json({ 
          success: true, 
          data: [],
          message: 'No frontend performance data available' 
        });
      }
      
      // 读取日志文件内容
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 解析日志数据并统计
      const frontendStats = {};
      
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          if (logEntry.message === 'info') {
            const pageUrl = logEntry.url;
            if (!frontendStats[pageUrl]) {
              frontendStats[pageUrl] = {
                page: pageUrl,
                totalLoads: 0,
                totalTime: 0,
                totalFcp: 0,
                avgLoadTime: 0,
                avgFcp: 0
              };
            }
            
            frontendStats[pageUrl].totalLoads++;
            frontendStats[pageUrl].totalTime += logEntry.loadEventEnd || 0;
            frontendStats[pageUrl].totalFcp += logEntry.firstContentfulPaint || 0;
          }
        } catch (parseError) {
          // 忽略解析错误的行
          continue;
        }
      }
      
      // 计算平均时间
      Object.values(frontendStats).forEach(stat => {
        if (stat.totalLoads > 0) {
          stat.avgLoadTime = Math.round(stat.totalTime / stat.totalLoads);
          stat.avgFcp = Math.round(stat.totalFcp / stat.totalLoads);
        }
      });
      
      res.json({ 
        success: true, 
        data: Object.values(frontendStats),
        message: 'Frontend performance data retrieved successfully' 
      });
    } catch (error) {
      console.error('Error getting frontend performance data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve frontend performance data' 
      });
    }
  }

  /**
   * 获取监控仪表板页面
   */
  static async getMonitoringDashboard(req, res) {
    try {
      res.sendFile(path.join(__dirname, '../../public/monitoring-dashboard.html'));
    } catch (error) {
      console.error('Error serving monitoring dashboard:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to serve monitoring dashboard' 
      });
    }
  }
}

module.exports = MonitoringController;