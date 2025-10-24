const axios = require('axios');

async function testProxy() {
  try {
    console.log('测试 Teable 代理连接...');
    
    // 测试 SQL 查询
    const response = await axios.post('http://localhost:42345/query', {
      sql: 'SELECT 1'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('代理连接成功:', response.data);
  } catch (error) {
    console.error('代理连接失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

testProxy();