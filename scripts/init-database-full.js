const { initDatabase } = require('../src/database/init');
const dbAdapter = require('../src/database/dbAdapter');

/**
 * 完整数据库初始化脚本
 * 用于创建所有必要的数据库表，包括新添加的工作流表
 */

async function initFullDatabase() {
  try {
    console.log('开始初始化完整数据库...');
    
    // 初始化所有表
    await initDatabase();
    
    // 验证关键表是否存在
    console.log('验证关键表是否存在...');
    
    const tablesToCheck = [
      'users',
      'roles',
      'transactions',
      'positions',
      'contract_orders',
      'binary_orders',
      'fund_transactions',
      'fund_positions',
      'user_follows',
      'trade_shares',
      'trading_contests',
      'contest_participants',
      'contest_trades',
      'workflows',
      'workflow_tasks'
    ];
    
    for (const table of tablesToCheck) {
      try {
        const result = await dbAdapter.executeQuery({
          table: table,
          operation: 'select',
          params: {
            take: 1
          }
        });
        console.log(`✅ 表 ${table} 存在`);
      } catch (error) {
        console.log(`❌ 表 ${table} 不存在或访问失败: ${error.message}`);
      }
    }
    
    console.log('数据库初始化完成！');
    console.log('现在可以访问以下新功能:');
    console.log('- 数据仪表盘: http://localhost:3001/dashboard.html');
    console.log('- 工作流管理: http://localhost:3001/workflow.html');
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initFullDatabase();
}

module.exports = initFullDatabase;