const axios = require('axios');

async function testDirectAPI() {
  const apiBase = 'https://teable.io';
  const baseId = 'accBtf7wmWSWmxEmTbc_Lt4EeDps';
  const apiToken = 'teable_accIL96c04fYcrQfecD_uVPFoJqEXcKmAjbRLUA1BpubL0rgHvmvxDgwHDtdYeA=';
  
  try {
    console.log('测试直接API连接...');
    
    // 测试获取表列表
    const response = await axios.get(`${apiBase}/api/base/${baseId}/table`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API连接成功:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API连接失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDirectAPI();