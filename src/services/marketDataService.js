const socketService = require('./socketService');

class MarketDataService {
  constructor() {
    this.symbols = [
      { symbol: 'SH_FUTURE', basePrice: 1000 },
      { symbol: 'HK_FUTURE', basePrice: 800 },
      { symbol: 'NY_FUTURE', basePrice: 1200 },
      { symbol: 'OIL_FUTURE', basePrice: 85 },
      { symbol: 'GOLD_FUTURE', basePrice: 1950 }
    ];
    this.isRunning = false;
    this.updateInterval = null;
  }

  // 启动市场数据模拟
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('市场数据服务已启动');
    this.generateMarketData();
  }

  // 停止市场数据模拟
  stop() {
    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('市场数据服务已停止');
  }

  // 生成市场数据
  generateMarketData() {
    if (!this.isRunning) return;

    try {
      // 为每个交易品种生成随机价格波动
      this.symbols.forEach(symbolInfo => {
        // 随机价格波动 (-0.5% 到 +0.5%)
        const changePercent = (Math.random() - 0.5) * 0.01;
        const newPrice = symbolInfo.basePrice * (1 + changePercent);
        
        // 更新基础价格
        symbolInfo.basePrice = newPrice;
        
        // 生成市场数据对象
        const marketData = {
          symbol: symbolInfo.symbol,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat((changePercent * 100).toFixed(2)),
          volume: Math.floor(Math.random() * 10000) + 5000, // 随机成交量
          timestamp: new Date().toISOString()
        };
        
        // 广播市场数据更新
        if (socketService) {
          socketService.broadcastMarketUpdate(marketData);
        }
      });

      // 每2秒更新一次市场数据
      this.updateInterval = setTimeout(() => this.generateMarketData(), 2000);
    } catch (error) {
      console.error('生成市场数据时出错:', error);
      // 即使出错也继续更新
      this.updateInterval = setTimeout(() => this.generateMarketData(), 2000);
    }
  }
}

// 创建单例实例
const marketDataService = new MarketDataService();

module.exports = marketDataService;