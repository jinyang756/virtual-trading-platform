#!/usr/bin/env node

/**
 * 定时检查系统性能并触发告警
 * 每5分钟运行一次
 */

const fs = require('fs');
const path = require('path');
const alertManager = require('../src/utils/alertManager');

class PerformanceAlertChecker {
  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
  }

  /**
   * 检查API性能日志并触发告警
   */
  async checkApiPerformance() {
    try {
      const logFilePath = path.join(this.logsDir, 'performance.log');
      if (!fs.existsSync(logFilePath)) {
        return;
      }

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 统计错误率
      let totalRequests = 0;
      let errorRequests = 0;
      
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          if (logEntry.message === 'info') {
            totalRequests++;
            if (logEntry.statusCode >= 500) {
              errorRequests++;
            }
          }
        } catch (parseError) {
          continue;
        }
      }
      
      if (totalRequests > 0) {
        const errorRate = (errorRequests / totalRequests) * 100;
        await alertManager.checkErrorRate(errorRate, 'API服务');
      }
    } catch (error) {
      console.error('Error checking API performance:', error);
    }
  }

  /**
   * 检查数据库性能日志并触发告警
   */
  async checkDatabasePerformance() {
    try {
      const logFilePath = path.join(this.logsDir, 'db-performance.log');
      if (!fs.existsSync(logFilePath)) {
        return;
      }

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 统计慢查询数量
      let slowQueries = 0;
      let totalQueries = 0;
      
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          totalQueries++;
          if (logEntry.level === 'warn' || logEntry.level === 'error') {
            slowQueries++;
          }
        } catch (parseError) {
          continue;
        }
      }
      
      // 检查慢查询数量是否超过阈值
      if (slowQueries > 0) {
        console.log(`Detected ${slowQueries} slow queries out of ${totalQueries} total queries`);
        
        // 如果慢查询数量超过阈值，触发告警
        if (slowQueries >= 10) { // 警告阈值
          await alertManager.sendAlert({
            type: 'slow_queries',
            severity: slowQueries >= 50 ? 'critical' : 'warning', // 50为严重阈值
            title: '数据库慢查询警告',
            message: `检测到 ${slowQueries} 个慢查询，占总查询数的 ${(slowQueries/totalQueries*100).toFixed(2)}%`,
            details: {
              slowQueries,
              totalQueries,
              percentage: (slowQueries/totalQueries*100).toFixed(2)
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking database performance:', error);
    }
  }

  /**
   * 检查前端性能日志并触发告警
   */
  async checkFrontendPerformance() {
    try {
      const logFilePath = path.join(this.logsDir, 'frontend-performance.log');
      if (!fs.existsSync(logFilePath)) {
        return;
      }

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim() !== '');
      
      // 统计页面加载时间
      let totalLoads = 0;
      let slowLoads = 0;
      let totalLoadTime = 0;
      
      for (const line of logLines) {
        try {
          const logEntry = JSON.parse(line);
          if (logEntry.message === 'info') {
            totalLoads++;
            const loadTime = logEntry.loadEventEnd || 0;
            totalLoadTime += loadTime;
            
            if (loadTime > 5000) { // 5秒阈值
              slowLoads++;
            }
          }
        } catch (parseError) {
          continue;
        }
      }
      
      if (totalLoads > 0) {
        const avgLoadTime = totalLoadTime / totalLoads;
        const slowLoadRate = (slowLoads / totalLoads) * 100;
        
        console.log(`Average page load time: ${avgLoadTime.toFixed(2)}ms, Slow load rate: ${slowLoadRate.toFixed(2)}%`);
        
        // 如果慢加载率超过阈值，触发告警
        if (slowLoadRate >= 5.0) { // 5%阈值
          await alertManager.sendAlert({
            type: 'slow_page_loads',
            severity: slowLoadRate >= 10.0 ? 'critical' : 'warning', // 10%为严重阈值
            title: '前端页面加载缓慢警告',
            message: `页面慢加载率 ${slowLoadRate.toFixed(2)}% 超过阈值，平均加载时间 ${avgLoadTime.toFixed(2)}ms`,
            details: {
              avgLoadTime: avgLoadTime.toFixed(2),
              slowLoadRate: slowLoadRate.toFixed(2),
              slowLoads,
              totalLoads
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking frontend performance:', error);
    }
  }

  /**
   * 执行所有检查
   */
  async runAllChecks() {
    console.log('Running performance alert checks...');
    
    await this.checkApiPerformance();
    await this.checkDatabasePerformance();
    await this.checkFrontendPerformance();
    
    console.log('Performance alert checks completed.');
  }
}

// 如果直接运行此脚本，则执行检查
if (require.main === module) {
  const checker = new PerformanceAlertChecker();
  checker.runAllChecks().catch(error => {
    console.error('Error in performance alert checker:', error);
    process.exit(1);
  });
}

module.exports = PerformanceAlertChecker;