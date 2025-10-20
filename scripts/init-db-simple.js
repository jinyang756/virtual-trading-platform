const { executeQuery } = require('../src/database/connection');

/**
 * 简化版数据库初始化脚本
 * 用于创建必要的数据库表（避免TIMESTAMP问题）
 */

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 创建用户表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        role_id VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `);
    
    // 创建角色表
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        permissions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `);
    
    console.log('数据库表创建成功');
  } catch (error) {
    console.error('创建数据库表时出错:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('开始初始化数据库...');
    await initDatabase();
    console.log('数据库初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行main函数
if (require.main === module) {
  main();
}

module.exports = initDatabase;