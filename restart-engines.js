#!/usr/bin/env node

/**
 * 重启虚拟交易引擎脚本
 * 用于安全地重启所有交易引擎，避免扩展主机崩溃
 */

const fs = require('fs');
const path = require('path');

async function restartEngines() {
  try {
    console.log('开始重启虚拟交易引擎...');
    
    // 1. 停止现有的引擎实例
    console.log('1. 停止现有引擎实例...');
    try {
      const engineModulePath = path.join(__dirname, 'src', 'engine', 'index.js');
      if (require.cache[require.resolve(engineModulePath)]) {
        const engine = require(engineModulePath);
        if (engine && typeof engine.cleanup === 'function') {
          engine.cleanup();
          console.log('  已清理现有引擎实例');
        }
        
        // 删除模块缓存
        delete require.cache[require.resolve(engineModulePath)];
        console.log('  已删除引擎模块缓存');
      }
    } catch (cleanupError) {
      console.warn('  清理现有引擎实例时出错:', cleanupError.message);
    }
    
    // 2. 等待一段时间确保资源释放
    console.log('2. 等待资源释放...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. 重新加载引擎模块
    console.log('3. 重新加载引擎模块...');
    try {
      const engineModulePath = path.join(__dirname, 'src', 'engine', 'index.js');
      const engine = require(engineModulePath);
      console.log('  引擎模块重新加载成功');
      
      // 简单测试引擎是否正常工作
      if (engine && typeof engine.getAllMarketData === 'function') {
        const marketData = engine.getAllMarketData();
        console.log('  引擎功能测试通过');
      }
    } catch (loadError) {
      console.error('  重新加载引擎模块时出错:', loadError.message);
      throw loadError;
    }
    
    // 4. 重启服务器（如果需要）
    console.log('4. 引擎重启完成');
    console.log('虚拟交易引擎已成功重启！');
    
  } catch (error) {
    console.error('重启虚拟交易引擎失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行重启操作
if (require.main === module) {
  restartEngines().catch(console.error);
}

module.exports = { restartEngines };