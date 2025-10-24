const { TeableConnection } = require('./src/database/teableConnection');

async function testConnection() {
  try {
    // 从环境变量获取配置
    const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
    const baseId = process.env.TEABLE_BASE_ID || 'spcvpwg10UdGxULD4g6';
    const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';
    
    console.log('测试Teable连接...');
    console.log('API Base:', apiBase);
    console.log('Base ID:', baseId);
    
    // 创建Teable连接实例
    const teable = new TeableConnection(apiBase, baseId, apiToken);
    
    // 测试连接
    const result = await teable.testConnection();
    
    if (result.success) {
      console.log('连接成功!');
      console.log('表数量:', result.data.tableCount);
      console.log('表列表:', result.data.tables);
    } else {
      console.log('连接失败:', result.message);
      console.log('错误详情:', result.error);
    }
  } catch (error) {
    console.error('测试过程中出错:', error.message);
  }
}

testConnection();