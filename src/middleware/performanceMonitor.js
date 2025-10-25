const winston = require('winston');
const alertManager = require('../utils/alertManager');

// 创建性能日志记录器
const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/performance.log' })
  ]
});

// API性能监控中间件
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  // 监听响应结束事件
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // 转换为毫秒
    
    // 记录性能数据
    performanceLogger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // 如果响应时间超过阈值，记录警告并触发告警
    if (duration > 3000) { // 3秒阈值
      performanceLogger.warn({
        message: 'Slow API response',
        method: req.method,
        url: req.url,
        duration: duration,
        threshold: 3000
      });
      
      // 触发告警
      alertManager.checkApiResponseTime(duration, `${req.method} ${req.url}`);
    }
  });
  
  next();
};

module.exports = performanceMonitor;