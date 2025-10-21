const axios = require('axios');

// 测试管理后台API
async function testAdminAPI() {
  const baseURL = 'http://localhost:3002/api/admin';
  
  try {
    // 测试连接
    console.log('测试数据库连接...');
    const testResponse = await axios.get(`${baseURL}/test-connection`);
    console.log('连接测试结果:', testResponse.data);
    
    // 获取所有表
    console.log('\n获取所有表...');
    const tablesResponse = await axios.get(`${baseURL}/tables`);
    console.log('表列表:', tablesResponse.data);
    
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
    }
  }
}

testAdminAPI();