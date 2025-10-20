const dbAdapter = require('../src/database/dbAdapter');
const User = require('../src/models/User');
const ContractEngine = require('../src/engine/ContractEngine');
const BinaryOptionEngine = require('../src/engine/BinaryOptionEngine');
const PrivateFundEngine = require('../src/engine/PrivateFundEngine');

/**
 * 系统状态检查脚本
 * 检查数据库连接、用户数据、历史数据等系统状态
 */

async function checkSystemStatus() {
  console.log('=== 虚拟交易平台系统状态检查 ===\n');
  
  try {
    // 1. 检查数据库连接
    console.log('1. 检查数据库连接...');
    const dbResult = await dbAdapter.testConnection();
    console.log('   数据库连接状态:', dbResult.success ? '正常' : '异常');
    if (dbResult.message) {
      console.log('   数据库信息:', dbResult.message);
    }
    
    // 2. 检查用户表
    console.log('2. 检查用户表...');
    try {
      const userResult = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'select',
        params: {
          take: 1
        }
      });
      console.log('   用户表访问:', userResult.records ? '正常' : '异常');
    } catch (error) {
      console.log('   用户表检查失败:', error.message);
    }
    
    // 3. 检查交易表
    console.log('3. 检查交易表...');
    const tables = ['users', 'transactions', 'positions', 'contract_orders', 'binary_orders', 'fund_transactions', 'fund_positions'];
    for (const table of tables) {
      try {
        const result = await dbAdapter.executeQuery({
          table: table,
          operation: 'select',
          params: {
            take: 1
          }
        });
        console.log(`   ${table}表访问:`, result.records ? '正常' : '异常');
      } catch (error) {
        console.log(`   ${table}表检查失败:`, error.message);
      }
    }
    
    // 4. 检查合约引擎数据
    console.log('4. 检查合约引擎数据...');
    const contractEngine = new ContractEngine();
    const contractSymbols = Object.keys(contractEngine.symbols);
    console.log('   合约品种数量:', contractSymbols.length);
    for (const symbol of contractSymbols) {
      const marketData = contractEngine.getMarketData(symbol);
      console.log(`   ${symbol}当前价格:`, marketData.price);
      console.log(`   ${symbol}历史数据条数:`, contractEngine.priceHistory[symbol].length);
    }
    
    // 5. 检查二元期权引擎数据
    console.log('5. 检查二元期权引擎数据...');
    const binaryEngine = new BinaryOptionEngine();
    const strategies = Object.keys(binaryEngine.strategies);
    console.log('   二元期权策略数量:', strategies.length);
    console.log('   历史统计数据条数:', Object.keys(binaryEngine.statisticsHistory).length);
    
    // 6. 检查私募基金引擎数据
    console.log('6. 检查私募基金引擎数据...');
    const fundEngine = new PrivateFundEngine();
    const funds = Object.keys(fundEngine.funds);
    console.log('   基金数量:', funds.length);
    for (const fund of funds) {
      const fundInfo = fundEngine.getFundInfo(fund);
      console.log(`   ${fund}当前净值:`, fundInfo.nav);
      console.log(`   ${fund}历史数据条数:`, fundEngine.navHistory[fund].length);
    }
    
    // 7. 检查测试用户
    console.log('7. 检查测试用户...');
    try {
      const adminUser = await User.findByUsername('admin');
      const testUser = await User.findByUsername('testuser');
      console.log('   管理员用户:', adminUser ? '存在' : '不存在');
      console.log('   测试用户:', testUser ? '存在' : '不存在');
    } catch (error) {
      console.log('   用户检查失败:', error.message);
    }
    
    console.log('\n=== 系统状态检查完成 ===');
    
  } catch (error) {
    console.error('系统状态检查失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行状态检查
if (require.main === module) {
  checkSystemStatus();
}

module.exports = {
  checkSystemStatus
};