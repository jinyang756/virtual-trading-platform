const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const baseId = process.env.TEABLE_BASE_ID || 'spcvpwg10UdGxULD4g6';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

console.log('API Base:', apiBase);
console.log('Base ID:', baseId);
console.log('API Token:', apiToken ? '已设置' : '未设置');

async function testCreateTable() {
  try {
    // 创建 axios 实例
    const client = axios.create({
      baseURL: `${apiBase}/api/base/${baseId}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('请求URL:', `${apiBase}/api/base/${baseId}/table`);
    
    console.log('测试创建表...');
    
    // 尝试创建表
    const response = await client.post('/table', {
      name: 'test_table',
      description: '测试表'
    });
    
    console.log('创建表成功:', response.data);
  } catch (error) {
    console.error('创建表失败:');
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