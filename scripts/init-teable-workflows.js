const dbAdapter = require('../src/database/dbAdapter');
const teableConfig = require('../config/teableConfig');

/**
 * Teable工作流表初始化脚本
 * 用于在Teable数据库中创建工作流相关表
 */

async function initTeableWorkflows() {
  try {
    console.log('开始初始化Teable工作流表...');
    
    // 检查当前数据库类型
    const currentDb = dbAdapter.getCurrentDatabase();
    if (currentDb !== 'teable') {
      console.log(`当前使用的是 ${currentDb} 数据库，此脚本仅适用于Teable数据库`);
      return;
    }
    
    console.log('当前数据库类型: Teable');
    
    // 在Teable中创建表的逻辑
    // 注意：Teable是NoSQL数据库，表结构是动态的，我们只需要确保表存在即可
    console.log('Teable数据库表结构是动态的，无需显式创建表');
    console.log('确保以下表在Teable中存在:');
    console.log('- workflows');
    console.log('- workflow_tasks');
    
    // 验证表是否存在
    console.log('验证表结构...');
    
    try {
      // 测试获取工作流表记录
      const workflowTest = await dbAdapter.executeQuery({
        table: 'workflows',
        operation: 'select',
        params: { take: 1 }
      });
      console.log('✅ workflows 表可访问');
    } catch (error) {
      console.log('⚠️  workflows 表可能需要在Teable中手动创建');
    }
    
    try {
      // 测试获取工作流任务表记录
      const taskTest = await dbAdapter.executeQuery({
        table: 'workflow_tasks',
        operation: 'select',
        params: { take: 1 }
      });
      console.log('✅ workflow_tasks 表可访问');
    } catch (error) {
      console.log('⚠️  workflow_tasks 表可能需要在Teable中手动创建');
    }
    
    console.log('\nTeable工作流表初始化说明:');
    console.log('1. 登录到Teable控制台: https://teable.io');
    console.log('2. 找到数据库: accBtf7wmWSWmxEmTbc_Lt4EeDps');
    console.log('3. 创建以下表:');
    console.log('   - workflows: 存储工作流定义和状态');
    console.log('   - workflow_tasks: 存储工作流任务详情');
    console.log('4. 为每个表定义相应的字段结构');
    console.log('5. 确保API Token具有读写权限');
    
    console.log('\n工作流表字段建议:');
    console.log('\nworkflows表字段:');
    console.log('- id (文本)');
    console.log('- name (文本)');
    console.log('- description (长文本)');
    console.log('- type (文本)');
    console.log('- config (JSON)');
    console.log('- status (文本, 默认: pending)');
    console.log('- created_by (文本)');
    console.log('- created_at (日期时间)');
    console.log('- updated_at (日期时间)');
    
    console.log('\nworkflow_tasks表字段:');
    console.log('- id (文本)');
    console.log('- workflow_id (文本)');
    console.log('- name (文本)');
    console.log('- description (长文本)');
    console.log('- status (文本, 默认: pending)');
    console.log('- config (JSON)');
    console.log('- result (JSON)');
    console.log('- created_at (日期时间)');
    console.log('- updated_at (日期时间)');
    
    console.log('\nTeable工作流表初始化完成！');
    
  } catch (error) {
    console.error('Teable工作流表初始化失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initTeableWorkflows();
}

module.exports = initTeableWorkflows;