try {
  const VirtualTradingEngine = require('./VirtualTradingEngine');

  // 创建全局单例实例
  const tradingEngine = new VirtualTradingEngine();

  module.exports = tradingEngine;
} catch (error) {
  console.error('虚拟交易引擎初始化失败:', error);
  throw error;
}