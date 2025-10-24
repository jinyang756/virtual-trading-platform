const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const baseId = process.env.TEABLE_BASE_ID || 'bsesJG9zTxCFYUdcNyV';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

console.log('API Base:', apiBase);
console.log('Base ID:', baseId);
console.log('API Token:', apiToken ? '已设置' : '未设置');

async function listTablesWithFields() {
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
    
    console.log('获取所有表...');
    
    // 获取所有表
    const response = await client.get('/table');
    
    console.log('响应状态:', response.status);
    
    console.log('表列表:');
    if (response.data && Array.isArray(response.data)) {
      for (const table of response.data) {
        console.log(`\n- ${table.id}: ${table.name} (${table.description || '无描述'})`);
        
        // 获取表的字段信息
        try {
          const fieldResponse = await client.get(`/table/${table.id}/field`);
          console.log(`  字段列表:`);
          if (fieldResponse.data && Array.isArray(fieldResponse.data)) {
            fieldResponse.data.forEach(field => {
              console.log(`    - ${field.id}: ${field.name} (${field.type}) - ${field.description || '无注释'}`);
            });
          }
        } catch (fieldError) {
          console.log(`  获取字段信息失败: ${fieldError.message}`);
        }
      }
    } else {
      console.log('响应数据格式不正确:', response.data);
    }
  } catch (error) {
    console.error('获取表列表失败:');
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

listTablesWithFields();