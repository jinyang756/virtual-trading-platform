const { initDatabase } = require('./src/database/init');
const MarketDataUpdater = require('./scripts/update-market-data');

/**
 * 系统启动脚本
 * 初始化数据库并启动市场数据更新服务
 */

async function startSystem() {
  console.log('=== 虚拟交易平台启动 ===\n');
  
  try {
    // 初始化数据库
    console.log('1. 初始化数据库...');
    await initDatabase();
    console.log('   数据库初始化完成\n');
    
    // 启动市场数据更新服务
    console.log('2. 启动市场数据更新服务...');
    const updater = new MarketDataUpdater();
    console.log('   市场数据更新服务已启动\n');
    
    // 启动Web服务器
    console.log('3. 启动Web服务器...');
    require('./server');
    
    console.log('=== 系统启动完成 ===\n');
    console.log('系统正在运行中...');
    console.log('- Web服务器: http://localhost:3001');
    console.log('- 市场数据更新服务: 已启动');
    console.log('- 数据库: 已连接');
    
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