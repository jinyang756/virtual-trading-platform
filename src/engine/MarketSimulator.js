const MarketData = require('../models/MarketData');

class MarketSimulator {
  constructor() {
    this.assets = {};
    this.volatility = 0.02; // 默认波动率
  }

  // 初始化市场模拟器
  initialize(assets) {
    this.assets = assets;
  }

  // 获取当前价格
  async getCurrentPrice(asset) {
    // 从数据库获取最新价格
    const price = await MarketData.getPrice(asset);
    
    if (price === undefined) {
      // 如果没有历史数据，生成初始价格
      return this.generateInitialPrice(asset);
    }
    
    // 添加随机波动
    return this.addVolatility(price);
  }

  // 生成初始价格
  generateInitialPrice(asset) {
    // 为不同资产设置不同的初始价格范围
    switch (asset) {
      case 'BTC':
        return 30000 + Math.random() * 20000;
      case 'ETH':
        return 2000 + Math.random() * 3000;
      case 'AAPL':
        return 150 + Math.random() * 100;
      case 'GOOGL':
        return 2500 + Math.random() * 1000;
      default:
        return 100 + Math.random() * 200;
    }
  }

  // 添加波动性
  addVolatility(currentPrice) {
    const changePercent = (Math.random() - 0.5) * 2 * this.volatility;
    return currentPrice * (1 + changePercent);
  }

  // 更新市场价格
  async updateMarket(asset, price) {
    const timestamp = new Date();
    await MarketData.update(asset, price, timestamp);
    
    // 更新内部缓存
    if (!this.assets[asset]) {
      this.assets[asset] = { price: price };
    } else {
      this.assets[asset].price = price;
    }
  }

  // 模拟市场价格变动
  async simulateMarketMovement() {
    for (const asset in this.assets) {
      const currentPrice = await this.getCurrentPrice(asset);
      await this.updateMarket(asset, currentPrice);
    }
  }

  // 设置波动率
  setVolatility(volatility) {
    this.volatility = volatility;
  }
}

module.exports = MarketSimulator;