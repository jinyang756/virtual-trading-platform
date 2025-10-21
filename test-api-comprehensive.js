const axios = require('axios');

async function testComprehensiveAPI() {
  const apiBase = 'https://teable.io';
  const baseId = 'accBtf7wmWSWmxEmTbc_Lt4EeDps';
  const apiToken = 'teable_accIL96c04fYcrQfecD_uVPFoJqEXcKmAjbRLUA1BpubL0rgHvmvxDgwHDtdYeA=';
  
  console.log('全面测试API端点...');
  
  // 测试各种可能的端点组合
  const endpoints = [
    // 基础端点
    `${apiBase}/api/base/${baseId}`,
    `${apiBase}/api/bases/${baseId}`,
    `${apiBase}/api/v1/base/${baseId}`,
    `${apiBase}/api/v1/bases/${baseId}`,
    
    // 表相关端点
    `${apiBase}/api/base/${baseId}/table`,
    `${apiBase}/api/bases/${baseId}/tables`,
    `${apiBase}/api/v1/base/${baseId}/table`,
    `${apiBase}/api/v1/bases/${baseId}/tables`,
    
    // 记录相关端点
    `${apiBase}/api/base/${baseId}/record`,
    `${apiBase}/api/bases/${baseId}/records`,
    
    // 可能的根端点
    `${apiBase}/api`,
    `${apiBase}/api/v1`,
    
    // 直接访问base
    `${apiBase}/base/${baseId}`,
    `${apiBase}/bases/${baseId}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n测试端点: ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5秒超时
      });
      
      console.log(`✅ 端点成功 (${response.status}):`, JSON.stringify(response.data, null, 2));
      return; // 如果找到有效的端点，就停止测试
    } catch (error) {
      if (error.response) {
        console.log(`❌ 端点失败 (${error.response.status}): ${error.response.statusText}`);
        // 如果是401未授权，可能是Token问题
        if (error.response.status === 401) {
          console.log('  可能是API Token无效或权限不足');
        }
        // 如果是403禁止访问，可能是权限问题
        else if (error.response.status === 403) {
          console.log('  可能是API Token权限不足');
        }
      } else if (error.request) {
        console.log(`❌ 请求失败: 无响应`);
      } else {
        console.log(`❌ 请求失败: ${error.message}`);
      }
    }
  }
  
  console.log('\n所有端点测试完成，未找到有效的API端点。');
}

testComprehensiveAPI();