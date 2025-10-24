const winston = require('winston');
const alertManager = require('../utils/alertManager');

// 创建数据库性能日志记录器
const dbPerformanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/db-performance.log' })
  ]
});

// 数据库查询性能监控类
class DatabasePerformanceMonitor {
  static queryStart(query, params) {
    return {
      startTime: process.hrtime.bigint(),
      query: query,
      params: params
    };
  }

  static queryEnd(queryInfo, result, error = null) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - queryInfo.startTime) / 1000000; // 转换为毫秒
    
    const logData = {
      query: queryInfo.query,
      params: queryInfo.params,
      duration: duration,
      rowsAffected: result ? (result.affectedRows || result.length || 0) : 0,
      timestamp: new Date().toISOString()
    };

    if (error) {
      logData.error = error.message;
      dbPerformanceLogger.error('Database query failed', logData);
    } else {
      dbPerformanceLogger.info('Database query executed', logData);
      
      // 如果查询时间超过阈值，记录警告并触发告警
      if (duration > 500) { // 500毫秒阈值
        dbPerformanceLogger.warn('Slow database query detected', {
          ...logData,
          threshold: 500
        });
        
        // 触发告警
        alertManager.checkDbQueryTime(duration, queryInfo.query);
      }
    }
    
    return duration;
  }

  // 分析慢查询日志
  static analyzeSlowQueries() {
    // 这里可以实现慢查询日志分析逻辑
    // 例如读取MySQL慢查询日志并生成报告
    console.log('Analyzing slow query logs...');
  }
}

module.exports = DatabasePerformanceMonitor;