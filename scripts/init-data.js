const { initDatabase } = require('../src/database/init');
const User = require('../src/models/User');
const ContractEngine = require('../src/engine/ContractEngine');
const BinaryOptionEngine = require('../src/engine/BinaryOptionEngine');
const PrivateFundEngine = require('../src/engine/PrivateFundEngine');
const { generateId } = require('../src/utils/codeGenerator');
const bcrypt = require('bcrypt');

/**
 * 初始化系统数据脚本
 * 包括：
 * 1. 创建测试用户
 * 2. 重新生成历史数据
 * 3. 初始化系统状态
 */

async function initSystemData() {
  try {
    console.log('开始初始化系统数据...');
    
    // 初始化数据库
    await initDatabase();
    console.log('数据库初始化完成');
    
    // 创建测试用户
    await createTestUsers();
    console.log('测试用户创建完成');
    
    // 重新生成历史数据
    await generateHistoricalData();
    console.log('历史数据生成完成');
    
    console.log('系统数据初始化完成！');
  } catch (error) {
    console.error('初始化系统数据时出错:', error);
    process.exit(1);
  }
}

async function createTestUsers() {
  try {
    // 创建管理员用户
    const adminUserId = 'admin_' + generateId();
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = new User(
      adminUserId,
      'admin',
      'admin@example.com',
      adminPasswordHash
    );
    await adminUser.save();
    
    // 创建普通用户
    const normalUserId = 'user_' + generateId();
    const userPasswordHash = await bcrypt.hash('user123', 10);
    const normalUser = new User(
      normalUserId,
      'testuser',
      'user@example.com',
      userPasswordHash
    );
    await normalUser.save();
    
    console.log('创建了2个测试用户: admin和testuser');
  } catch (error) {
    console.error('创建测试用户时出错:', error);
  }
}

async function generateHistoricalData() {
  try {
    // 重新生成合约交易历史数据
    console.log('生成合约交易历史数据...');
    const contractEngine = new ContractEngine();
    
    // 重新生成二元期权历史数据
    console.log('生成二元期权历史数据...');
    const binaryEngine = new BinaryOptionEngine();
    
    // 重新生成私募基金历史数据
    console.log('生成私募基金历史数据...');
    const fundEngine = new PrivateFundEngine();
    
    console.log('所有历史数据生成完成');
  } catch (error) {
    console.error('生成历史数据时出错:', error);
  }
}

// 运行初始化脚本
if (require.main === module) {
  initSystemData();
}

module.exports = {
  initSystemData,
  createTestUsers,
  generateHistoricalData
};