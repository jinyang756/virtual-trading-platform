const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.io';
const baseId = process.env.TEABLE_BASE_ID || 'spcQK5E03lbUN2YVLNw';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accfdOzwYwyzYeNskpI_xsfCZrpItL2jbOHf7SFf7MLexWnBDubSOckOVNEiKU4=';

async function listTables() {
  try {
    // 创建 axios 实例
    const client = axios.create({
      baseURL: `${apiBase}/api/base/${baseId}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('获取所有表...');
    
    // 获取所有表
    const response = await client.get('/table');
    
    console.log('表列表:');
    response.data.forEach(table => {
      console.log(`- ${table.id}: ${table.name} (${table.description || '无描述'})`);
    });
  } catch (error) {
    console.error('获取表列表失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

listTables();