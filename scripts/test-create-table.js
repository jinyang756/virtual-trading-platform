const axios = require('axios');

async function testCreateTable() {
  try {
    console.log('测试创建 funds 表...');
    
    // 先测试连接
    const testResponse = await axios.get('http://localhost:3001/api/admin/test-connection');
    console.log('数据库连接测试:', testResponse.data);
    
    // 再测试获取所有表
    const tablesResponse = await axios.get('http://localhost:3001/api/admin/tables');
    console.log('当前表列表:', tablesResponse.data);
    
    // 尝试创建表
    const createResponse = await axios.post('http://localhost:3001/api/admin/tables', {
      tableName: 'funds',
      description: '私募基金基础信息表'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('创建表结果:', createResponse.data);
  } catch (error) {
    console.error('错误详情:');
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

testCreateTable();