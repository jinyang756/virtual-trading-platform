#!/usr/bin/env node

/**
 * 测试虚拟交易引擎修复脚本
 * 用于验证引擎修复是否成功
 */

const path = require('path');

async function testEngineFix() {
  try {
    console.log('开始测试虚拟交易引擎修复...');
    
    // 1. 测试引擎模块加载
    console.log('1. 测试引擎模块加载...');
    const engineModulePath = path.join(__dirname, 'src', 'engine', 'index.js');
    const engine = require(engineModulePath);
    console.log('  ✓ 引擎模块加载成功');
    
    // 2. 测试各个子引擎
    console.log('2. 测试各个子引擎...');
    
    // 测试合约引擎
    if (engine.contractEngine) {
      console.log('  ✓ 合约引擎已初始化');
      const marketData = engine.contractEngine.getAllMarketData();
      console.log(`  ✓ 合约市场数据获取成功，包含 ${Object.keys(marketData).length} 个品种`);
    } else {
      console.error('  ✗ 合约引擎未初始化');
      return false;
    }
    
    // 测试二元期权引擎
    if (engine.binaryEngine) {
      console.log('  ✓ 二元期权引擎已初始化');
      const strategies = engine.binaryEngine.getStrategies();
      console.log(`  ✓ 二元期权策略获取成功，包含 ${strategies.length} 个策略`);
    } else {
      console.error('  ✗ 二元期权引擎未初始化');
      return false;
    }
    
    // 测试私募基金引擎
    if (engine.fundEngine) {
      console.log('  ✓ 私募基金引擎已初始化');
      const funds = engine.fundEngine.getAllFunds();
      console.log(`  ✓ 私募基金信息获取成功，包含 ${funds.length} 个基金`);
    } else {
      console.error('  ✗ 私募基金引擎未初始化');
      return false;
    }
    
    // 3. 测试综合功能
    console.log('3. 测试综合功能...');
    const allMarketData = engine.getAllMarketData();
    console.log('  ✓ 综合市场数据获取成功');
    
    console.log('\n🎉 虚拟交易引擎修复测试通过！');
    console.log('所有引擎均已正常初始化并可以正常工作。');
    
    return true;
  } catch (error) {
    console.error('虚拟交易引擎修复测试失败:', error);
    return false;
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testEngineFix().then(success => {
    if (success) {
      console.log('\n✅ 测试完成，引擎修复成功！');
      process.exit(0);
    } else {
      console.log('\n❌ 测试失败，引擎仍有问题！');
      process.exit(1);
    }
  }).catch(error => {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  });
}

module.exports = { testEngineFix };