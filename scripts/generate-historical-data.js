const HistoricalDataGenerator = require('../src/utils/historicalDataGenerator');

/**
 * 生成历史数据脚本
 * 用于生成从2025年8月1日开始的虚拟市场数据
 */

async function main() {
  try {
    console.log('开始执行历史数据生成脚本...');
    
    const generator = new HistoricalDataGenerator();
    const marketData = await generator.generateAndSave();
    
    console.log('\n生成的数据概览:');
    console.log('==================');
    
    for (const [symbol, data] of Object.entries(marketData)) {
      console.log(`${data.name} (${symbol}):`);
      console.log(`  当前价格: $${data.price}`);
      console.log(`  历史记录数: ${data.history.length}`);
      console.log(`  最后更新: ${data.lastUpdate}`);
      console.log('');
    }
    
    console.log('历史数据生成脚本执行完成!');
  } catch (error) {
    console.error('执行历史数据生成脚本时出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行main函数
if (require.main === module) {
  main();
}

module.exports = main;