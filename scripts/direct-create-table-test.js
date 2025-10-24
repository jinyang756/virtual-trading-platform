const { TeableConnection } = require('./src/database/teableConnection');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.io';
const baseId = process.env.TEABLE_BASE_ID || 'spcQK5E03lbUN2YVLNw';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accfdOzwYwyzYeNskpI_xsfCZrpItL2jbOHf7SFf7MLexWnBDubSOckOVNEiKU4=';

console.log('API Base:', apiBase);
console.log('Base ID:', baseId);
console.log('API Token:', apiToken ? '已设置' : '未设置');

async function testDirectCreateTable() {
  try {
    // 创建 TeableConnection 实例
    const teableConnection = new TeableConnection(apiBase, baseId, apiToken);
    
    console.log('测试直接调用 TeableConnection.createTable...');
    
    // 尝试创建表
    const result = await teableConnection.createTable('funds', '私募基金基础信息表');
    
    console.log('创建表成功:', result);
  } catch (error) {
    console.error('直接调用 TeableConnection.createTable 失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else {
      console.error('错误信息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  }
}

testDirectCreateTable();