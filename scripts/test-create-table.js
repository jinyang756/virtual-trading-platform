const axios = require('axios');

async function testCreateTable() {
  try {
    console.log('测试创建 funds 表...');
    
    // 先测试连接
    const testResponse = await axios.get('http://localhost:3000/api/admin/test-connection');
    console.log('数据库连接测试:', testResponse.data);
    
    // 再测试获取所有表
    const tablesResponse = await axios.get('http://localhost:3000/api/admin/tables');
    console.log('当前表列表:', tablesResponse.data);
    
    // 尝试创建表
    const createResponse = await axios.post('http://localhost:3000/api/admin/tables', {
      tableName: 'funds',
      description: '私募基金基础信息表'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('创建表结果:', createResponse.data);
  } catch (error) {
    console.error('错误详情:', error.response ? error.response.data : error.message);
  }
}

testCreateTable();