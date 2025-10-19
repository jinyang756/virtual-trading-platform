// 错误处理中间件
function errorHandler(err, req, res, next) {
  // 记录错误日志
  console.error('应用程序错误:', err);
  
  // 默认错误响应
  const errorResponse = {
    error: '内部服务器错误',
    message: err.message || '未知错误'
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
  }
  
  // 在开发环境中返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
}

// 404错误处理中间件
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: '资源未找到',
    message: `无法找到路径: ${req.originalUrl}`
  });
}

module.exports = (err, req, res, next) => {
  // 如果响应头已发送，交给默认错误处理程序
  if (res.headersSent) {
    return next(err);
  }
  
  // 使用自定义错误处理
  errorHandler(err, req, res, next);
};