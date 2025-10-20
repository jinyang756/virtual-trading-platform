const MarketDataUpdater = require('./scripts/update-market-data');

/**
 * 系统启动脚本
 * 启动市场数据更新服务和Web服务器
 */

async function startSystem() {
  console.log('=== 虚拟交易平台启动 ===\n');
  
  try {
    // 启动市场数据更新服务
    console.log('1. 启动市场数据更新服务...');
    const updater = new MarketDataUpdater();
    console.log('   市场数据更新服务已启动\n');
    
    // 启动Web服务器
    console.log('2. 启动Web服务器...');
    require('./server');
    
    console.log('=== 系统启动完成 ===\n');
    console.log('系统正在运行中...');
    console.log('- Web服务器: http://localhost:3001');
    console.log('- 市场数据更新服务: 已启动');
    console.log('- 数据库: 已连接 (Teable)');
    
  } catch (error) {
    console.error('系统启动失败:', error);
    process.exit(1);
  }
}

// 启动系统
if (require.main === module) {
  startSystem();
}

module.exports = {
  startSystem
};