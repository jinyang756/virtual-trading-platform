const axios = require('axios');

// 配置信息
const config = {
  apiBase: process.env.TEABLE_API_BASE || 'https://app.teable.cn',
  baseId: process.env.TEABLE_BASE_ID || 'bsesJG9zTxCFYUdcNyV',
  apiToken: process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A='
};

async function testApiEndpoints() {
  const client = axios.create({
    baseURL: `${config.apiBase}/api/base/${config.baseId}`,
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json'
      }
  });
  
  console.log('测试Teable API端点');
  console.log('Base URL:', `${config.apiBase}/api/base/${config.baseId}`);
  
  // 测试1: 获取表列表
  try {
    console.log('\n1. 测试获取表列表...');
    const tablesResponse = await client.get('/table');
    console.log('  状态码:', tablesResponse.status);
    console.log('  表数量:', tablesResponse.data.length);
    
    // 显示前几个表的信息
    tablesResponse.data.slice(0, 3).forEach(table => {
      console.log(`  - ${table.id}: ${table.name}`);
    });
  } catch (error) {
    console.error('  获取表列表失败:', error.response ? error.response.status : error.message);
    if (error.response) {
      console.error('  错误详情:', error.response.data);
    }
  }
  
  // 测试2: 获取特定表信息
  try {
    console.log('\n2. 测试获取特定表信息...');
    const tablesResponse = await client.get('/table');
    if (tablesResponse.data && tablesResponse.data.length > 0) {
      const firstTable = tablesResponse.data[0];
      console.log(`  测试表: ${firstTable.id} (${firstTable.name})`);
      
      // 尝试不同的字段端点
      const fieldEndpoints = [
        `/table/${firstTable.id}/field`,
        `/table/${firstTable.id}/fields`,
        `/field?tableId=${firstTable.id}`
      ];
      
      for (const endpoint of fieldEndpoints) {
        try {
          console.log(`  尝试端点: ${endpoint}`);
          const fieldResponse = await client.get(endpoint);
          console.log(`    成功! 状态码: ${fieldResponse.status}`);
          console.log(`    字段数量: ${fieldResponse.data.length}`);
          break;
        } catch (fieldError) {
          console.log(`    失败: ${fieldError.response ? fieldError.response.status : fieldError.message}`);
        }
      }
    }
  } catch (error) {
    console.error('  测试特定表信息失败:', error.response ? error.response.status : error.message);
  }
  
  // 测试3: 获取空间信息
  try {
    console.log('\n3. 测试获取空间信息...');
    const spaceClient = axios.create({
      baseURL: `${config.apiBase}/api`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const spaceResponse = await spaceClient.get('/space');
    console.log('  状态码:', spaceResponse.status);
    console.log('  空间数量:', spaceResponse.data.length);
    
    // 显示空间信息
    spaceResponse.data.slice(0, 2).forEach(space => {
      console.log(`  - ${space.id}: ${space.name}`);
    });
  } catch (error) {
    console.error('  获取空间信息失败:', error.response ? error.response.status : error.message);
    if (error.response) {
      console.error('  错误详情:', error.response.data);
    }
  }
}

testApiEndpoints();