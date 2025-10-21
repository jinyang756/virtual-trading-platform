const axios = require('axios');

async function testBothTokens() {
  const apiBase = 'https://teable.io';
  const baseId = 'accBtf7wmWSWmxEmTbc_Lt4EeDps';
  const token1 = 'teable_accIL96c04fYcrQfecD_uVPFoJqEXcKmAjbRLUA1BpubL0rgHvmvxDgwHDtdYeA=';
  const token2 = '0PBkAIVQhnDIKM7kEo4rUE0JIDfzt5cftE';
  
  console.log('测试两个不同的API Token...');
  
  // 测试第一个Token
  try {
    console.log('\n测试第一个Token...');
    const response1 = await axios.get(`${apiBase}/api/base/${baseId}`, {
      headers: {
        'Authorization': `Bearer ${token1}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('第一个Token成功:', JSON.stringify(response1.data, null, 2));
  } catch (error) {
    console.log('第一个Token失败:', error.response?.status || error.message);
  }
  
  // 测试第二个Token
  try {
    console.log('\n测试第二个Token...');
    const response2 = await axios.get(`${apiBase}/api/base/${baseId}`, {
      headers: {
        'Authorization': `Bearer ${token2}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('第二个Token成功:', JSON.stringify(response2.data, null, 2));
  } catch (error) {
    console.log('第二个Token失败:', error.response?.status || error.message);
  }
}

testBothTokens();