const ContractEngine = require('../src/engine/ContractEngine');
const PrivateFundEngine = require('../src/engine/PrivateFundEngine');

/**
 * 持续更新市场数据脚本
 * 定期更新合约价格和基金净值，保持数据最新
 */

class MarketDataUpdater {
  constructor() {
    this.contractEngine = new ContractEngine();
    this.fundEngine = new PrivateFundEngine();
    
    // 启动更新循环
    this.startUpdateLoop();
  }
  
  startUpdateLoop() {
    console.log('开始市场数据更新循环...');
    
    // 每5秒更新一次市场数据
    setInterval(() => {
      this.updateMarketData();
    }, 5000);
  }
  
  updateMarketData() {
    try {
      // 更新合约价格
      this.contractEngine.updateMarketData();
      
      // 更新基金净值
      this.fundEngine.updateFundNav();
      
      console.log(`[${new Date().toISOString()}] 市场数据更新完成`);
    } catch (error) {
      console.error('更新市场数据时出错:', error);
    }
  }
  
  // 手动触发一次更新
  manualUpdate() {
    this.updateMarketData();
  }
}

// 如果直接运行此脚本，则启动更新器
if (require.main === module) {
  const updater = new MarketDataUpdater();
  console.log('市场数据更新器已启动');
  
  // 处理退出信号
  process.on('SIGINT', () => {
    console.log('正在关闭市场数据更新器...');
    process.exit(0);
  });
}

module.exports = MarketDataUpdater;