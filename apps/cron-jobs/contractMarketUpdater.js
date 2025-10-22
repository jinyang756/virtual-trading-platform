#!/usr/bin/env node

/**
 * 合约行情更新定时任务
 * 定期更新合约市场数据
 */

const cron = require('node-cron');
const path = require('path');

// 设置项目根目录
const projectRoot = path.resolve(__dirname, '../..');
process.chdir(projectRoot);

// 导入合约引擎
const ContractTradingEngine = require('../../src/engine/ContractEngine');

// 创建合约引擎实例
const contractEngine = new ContractTradingEngine();

// 定时任务：每分钟更新一次合约行情数据
cron.schedule('* * * * *', () => {
  console.log(`[${new Date().toISOString()}] 开始执行合约行情更新任务`);
  
  try {
    // 更新市场数据
    contractEngine.updateMarketData();
    
    console.log(`[${new Date().toISOString()}] 合约行情更新任务执行完成`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 合约行情更新任务执行失败:`, error);
  }
});

console.log(`合约行情更新定时任务已启动，将每分钟执行一次`);
console.log(`当前时间: ${new Date().toISOString()}`);

// 立即执行一次（用于测试）
console.log(`[${new Date().toISOString()}] 立即执行一次合约行情更新（测试）`);
contractEngine.updateMarketData();
console.log(`[${new Date().toISOString()}] 测试执行完成`);