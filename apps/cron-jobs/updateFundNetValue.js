#!/usr/bin/env node

/**
 * 基金净值更新定时任务
 * 每日执行，更新所有基金的净值数据
 */

const cron = require('node-cron');
const path = require('path');

// 设置项目根目录
const projectRoot = path.resolve(__dirname, '../..');
process.chdir(projectRoot);

// 导入基金引擎
const PrivateFundEngine = require('../../src/engine/PrivateFundEngine');

// 创建基金引擎实例
const fundEngine = new PrivateFundEngine();

// 定时任务：每天凌晨2点执行
cron.schedule('0 2 * * *', () => {
  console.log(`[${new Date().toISOString()}] 开始执行基金净值更新任务`);
  
  try {
    // 更新基金净值
    fundEngine.updateFundNav();
    
    console.log(`[${new Date().toISOString()}] 基金净值更新任务执行完成`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 基金净值更新任务执行失败:`, error);
  }
});

console.log(`基金净值更新定时任务已启动，将在每天凌晨2点执行`);
console.log(`当前时间: ${new Date().toISOString()}`);

// 立即执行一次（用于测试）
console.log(`[${new Date().toISOString()}] 立即执行一次基金净值更新（测试）`);
fundEngine.updateFundNav();
console.log(`[${new Date().toISOString()}] 测试执行完成`);