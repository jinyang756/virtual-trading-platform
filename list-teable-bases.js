const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

console.log('API Base:', apiBase);
console.log('API Token:', apiToken ? '已设置' : '未设置');

async function listBases() {
  try {
    // 创建 axios 实例
    const client = axios.create({
      baseURL: `${apiBase}/api`,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('请求URL:', `${apiBase}/api/space`);
    
    console.log('获取所有空间...');
    
    // 获取所有空间
    const spaceResponse = await client.get('/space');
    
    console.log('空间列表:');
    if (spaceResponse.data && Array.isArray(spaceResponse.data)) {
      for (const space of spaceResponse.data) {
        console.log(`- ${space.id}: ${space.name}`);
        
        // 获取空间中的所有Base
        try {
          const baseResponse = await client.get(`/space/${space.id}/base`);
          console.log(`  Base列表:`);
          if (baseResponse.data && Array.isArray(baseResponse.data)) {
            for (const base of baseResponse.data) {
              console.log(`    - ${base.id}: ${base.name}`);
              
              // 获取Base中的所有表
              try {
                const tableClient = axios.create({
                  baseURL: `${apiBase}/api/base/${base.id}`,
                  headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                const tableResponse = await tableClient.get('/table');
                console.log(`      表数量: ${tableResponse.data.length}`);
                if (tableResponse.data && Array.isArray(tableResponse.data)) {
                  tableResponse.data.forEach(table => {
                    console.log(`        - ${table.id}: ${table.name} (${table.description || '无描述'})`);
                  });
                }
              } catch (tableError) {
                console.log(`      获取表列表失败: ${tableError.message}`);
              }
            }
          }
        } catch (baseError) {
          console.log(`  获取Base列表失败: ${baseError.message}`);
        }
      }
    } else {
      console.log('响应数据格式不正确:', spaceResponse.data);
    }
  } catch (error) {
    console.error('获取空间列表失败:');
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

listBases();