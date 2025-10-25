const logger = require('../utils/logger');

/**
 * 性能监控中间件
 * 记录API请求的性能指标
 */
function performanceMonitor(req, res, next) {
  // 记录请求开始时间
  const startTime = Date.now();
  
  // 监听响应完成事件
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // 记录性能日志
    logger.info('API性能监控', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    });
    
    // 如果响应时间超过阈值，记录警告
    if (duration > 1000) {
      logger.warn('API响应时间过长', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        threshold: '1000ms'
      });
    }
  });
  
  next();
}

module.exports = performanceMonitor;