const dbAdapter = require('./src/database/dbAdapter');

async function createTables() {
  try {
    console.log('测试数据库连接...');
    const connectionResult = await dbAdapter.testConnection();
    console.log('连接测试结果:', connectionResult);
    
    if (!connectionResult.success) {
      console.error('数据库连接失败:', connectionResult.message);
      return;
    }
    
    console.log('开始创建表...');
    
    // 创建用户表
    console.log('创建 users 表...');
    const usersResult = await dbAdapter.createTable('users', '用户信息表');
    console.log('users 表创建结果:', usersResult);
    
    // 创建角色表
    console.log('创建 roles 表...');
    const rolesResult = await dbAdapter.createTable('roles', '角色信息表');
    console.log('roles 表创建结果:', rolesResult);
    
    // 创建权限表
    console.log('创建 permissions 表...');
    const permissionsResult = await dbAdapter.createTable('permissions', '权限信息表');
    console.log('permissions 表创建结果:', permissionsResult);
    
    // 创建交易表
    console.log('创建 transactions 表...');
    const transactionsResult = await dbAdapter.createTable('transactions', '交易记录表');
    console.log('transactions 表创建结果:', transactionsResult);
    
    // 创建持仓表
    console.log('创建 positions 表...');
    const positionsResult = await dbAdapter.createTable('positions', '持仓记录表');
    console.log('positions 表创建结果:', positionsResult);
    
    console.log('所有表创建完成!');
    
  } catch (error) {
    console.error('创建表时出错:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }
}

createTables();