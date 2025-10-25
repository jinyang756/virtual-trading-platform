const app = require('./src/app');
const socketService = require('./src/services/socketService');
const marketDataService = require('./src/services/marketDataService');
const config = require('./config');

// 如果不是在特定云环境，则直接启动服务器
if (!process.env.CLOUD_ENV) {
  const PORT = process.env.PORT || config.port;
  
  // 启动HTTP服务器
  const server = app.listen(PORT, () => {
    console.log(`Virtual Trading Platform server is running on port ${PORT}`);
    console.log(`系统管理面板访问地址: http://localhost:${PORT}/admin/panel`);
    console.log(`用户端仪表板访问地址: http://localhost:${PORT}/client/dashboard`);
    console.log(`移动端客户端访问地址: http://localhost:${PORT}/mobile`);
  });

  // 初始化Socket.IO服务
  try {
    socketService.init(server);
  } catch (socketError) {
    console.error('Socket.IO服务初始化失败:', socketError);
  }
  
  // 启动市场数据服务
  try {
    marketDataService.start();
  } catch (marketError) {
    console.error('市场数据服务启动失败:', marketError);
  }

  // 添加优雅关闭处理
  process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，开始优雅关闭...');
    shutdown();
  });

  process.on('SIGINT', () => {
    console.log('收到SIGINT信号，开始优雅关闭...');
    shutdown();
  });

  // 优雅关闭函数
  function shutdown() {
    console.log('开始关闭服务器...');
    
    // 停止市场数据服务
    try {
      if (marketDataService && typeof marketDataService.stop === 'function') {
        marketDataService.stop();
      }
    } catch (error) {
      console.error('停止市场数据服务时出错:', error);
    }
    
    // 清理Socket.IO服务
    try {
      if (socketService && typeof socketService.cleanup === 'function') {
        socketService.cleanup();
      }
    } catch (error) {
      console.error('清理Socket.IO服务时出错:', error);
    }
    
    // 关闭HTTP服务器
    server.close(() => {
      console.log('HTTP服务器已关闭');
      process.exit(0);
    });
    
    // 如果30秒后仍未关闭，则强制退出
    setTimeout(() => {
      console.error('优雅关闭超时，强制退出');
      process.exit(1);
    }, 30000);
  }

  module.exports = server;
} else {
  // 在云环境中，只导出应用实例
  module.exports = app;
}