#!/usr/bin/env node

/**
 * 期权行情更新定时任务
 * 定期更新期权市场数据
 */

const cron = require('node-cron');
const path = require('path');

// 设置项目根目录
const projectRoot = path.resolve(__dirname, '../..');
process.chdir(projectRoot);

// 导入二元期权引擎
const BinaryOptionEngine = require('../../src/engine/BinaryOptionEngine');

// 创建二元期权引擎实例
const binaryOptionEngine = new BinaryOptionEngine();

// 定时任务：每分钟更新一次期权行情数据
cron.schedule('* * * * *', () => {
  console.log(`[${new Date().toISOString()}] 开始执行期权行情更新任务`);
  
  try {
    // 更新市场数据
    binaryOptionEngine.updateMarketData();
    
    console.log(`[${new Date().toISOString()}] 期权行情更新任务执行完成`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 期权行情更新任务执行失败:`, error);
  }
});

console.log(`期权行情更新定时任务已启动，将每分钟执行一次`);
console.log(`当前时间: ${new Date().toISOString()}`);

// 立即执行一次（用于测试）
console.log(`[${new Date().toISOString()}] 立即执行一次期权行情更新（测试）`);
binaryOptionEngine.updateMarketData();
console.log(`[${new Date().toISOString()}] 测试执行完成`);