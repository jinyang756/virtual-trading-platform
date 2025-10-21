// 测试API连接
require('dotenv').config();
const app = require('./src/app');

// 创建一个简单的测试服务器
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`测试服务器运行在端口 ${PORT}`);
  console.log('可用的API端点:');
  console.log('- POST /api/users/register');
  console.log('- POST /api/users/login');
  console.log('- POST /api/trade/order');
  console.log('- GET /health');
});