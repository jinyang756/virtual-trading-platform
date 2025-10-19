const logger = require('../utils/logger');

// 增强的错误处理中间件
function enhancedErrorHandler(err, req, res, next) {
  // 记录错误日志
  logger.error('应用程序错误', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // 默认错误响应
  const errorResponse = {
    error: '内部服务器错误',
    message: err.message || '未知错误',
    timestamp: new Date().toISOString()
  };
  
  // 根据错误类型返回不同的状态码
  let statusCode = 500;
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error = '验证错误';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse.error = '未授权访问';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorResponse.error = '禁止访问';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorResponse.error = '资源未找到';
  } else if (err.name === 'BusinessError') {
    // 自定义业务错误
    statusCode = 400;
    errorResponse.error = '业务错误';
  }
  
  // 在开发环境中返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
}

// 404错误处理中间件
function notFoundHandler(req, res, next) {
  const errorMessage = `无法找到路径: ${req.originalUrl}`;
  
  // 记录404错误
  logger.warn('404错误', {
    message: errorMessage,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  res.status(404).json({
    error: '资源未找到',
    message: errorMessage,
    timestamp: new Date().toISOString()
  });
}

// 业务错误类
class BusinessError extends Error {
  constructor(message, code = 'BUSINESS_ERROR') {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

// 验证错误类
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// 未授权错误类
class UnauthorizedError extends Error {
  constructor(message = '未授权访问') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// 禁止访问错误类
class ForbiddenError extends Error {
  constructor(message = '禁止访问') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// 资源未找到错误类
class NotFoundError extends Error {
  constructor(message = '资源未找到') {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  enhancedErrorHandler: (err, req, res, next) => {
    // 如果响应头已发送，交给默认错误处理程序
    if (res.headersSent) {
      return next(err);
    }
    
    // 使用增强的错误处理
    enhancedErrorHandler(err, req, res, next);
  },
  notFoundHandler,
  BusinessError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
};