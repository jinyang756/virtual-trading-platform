const VirtualTradingEngine = require('./VirtualTradingEngine');

// 创建全局单例实例
const tradingEngine = new VirtualTradingEngine();

module.exports = tradingEngine;