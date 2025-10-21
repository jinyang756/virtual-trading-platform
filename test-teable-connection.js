const teableConnection = require('./src/database/teableConnection');

async function testConnection() {
  try {
    console.log('测试Teable连接...');
    const result = await teableConnection.testConnection();
    console.log('测试结果:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testConnection();