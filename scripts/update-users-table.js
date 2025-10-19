const { executeQuery } = require('../src/database/connection');

async function updateUsersTable() {
  try {
    console.log('检查用户表结构...');
    
    // 检查表结构
    const columns = await executeQuery('DESCRIBE users');
    console.log('当前表结构:', columns.map(col => col.Field));
    
    // 检查是否需要添加 balance 列
    const hasBalance = columns.some(col => col.Field === 'balance');
    if (!hasBalance) {
      console.log('添加 balance 列...');
      await executeQuery('ALTER TABLE users ADD COLUMN balance DECIMAL(15,2) DEFAULT 100000.00');
      console.log('balance 列添加成功');
    } else {
      console.log('balance 列已存在');
    }
    
    // 检查是否需要添加 role_id 列
    const hasRoleId = columns.some(col => col.Field === 'role_id');
    if (!hasRoleId) {
      console.log('添加 role_id 列...');
      await executeQuery("ALTER TABLE users ADD COLUMN role_id VARCHAR(50) DEFAULT 'user'");
      console.log('role_id 列添加成功');
    } else {
      console.log('role_id 列已存在');
    }
    
    console.log('用户表结构更新完成');
  } catch (error) {
    console.error('更新表结构时出错:', error.message);
  } finally {
    process.exit(0);
  }
}

updateUsersTable();