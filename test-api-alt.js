const axios = require('axios');

async function testAlternativeAPI() {
  const apiBase = 'https://teable.io';
  const baseId = 'accBtf7wmWSWmxEmTbc_Lt4EeDps';
  const apiToken = 'teable_accIL96c04fYcrQfecD_uVPFoJqEXcKmAjbRLUA1BpubL0rgHvmvxDgwHDtdYeA=';
  
  try {
    console.log('测试替代API端点...');
    
    // 尝试不同的API端点
    const endpoints = [
      `${apiBase}/api/base/${baseId}`,
      `${apiBase}/api/v1/base/${baseId}`,
      `${apiBase}/api/bases/${baseId}`,
      `${apiBase}/api/v1/bases/${baseId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`测试端点: ${endpoint}`);
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`端点 ${endpoint} 成功:`, JSON.stringify(response.data, null, 2));
        return;
      } catch (error) {
        console.log(`端点 ${endpoint} 失败: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('所有端点都失败了');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testAlternativeAPI();