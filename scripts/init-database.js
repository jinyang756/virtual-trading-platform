const { initDatabase } = require('../src/database/init');

/**
 * 数据库初始化脚本
 * 用于创建必要的数据库表
 */

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

module.exports = main;