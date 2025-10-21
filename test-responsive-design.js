// 测试响应式设计的完整功能
require('dotenv').config();
const app = require('./src/app');

// 如果不是在 Vercel 玎境中，则直接启动服务器
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3002;
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`测试服务器运行在端口 ${PORT}`);
    console.log('\n=== 响应式设计测试 ===');
    console.log('1. 移动端路由注册测试:');
    console.log('   - GET /mobile/login');
    console.log('   - GET /mobile');
    console.log('   - GET /mobile/market');
    console.log('   - GET /mobile/trade');
    console.log('   - GET /mobile/profile');
    console.log('\n2. API调用测试:');
    console.log('   - POST /api/users/register');
    console.log('   - POST /api/users/login');
    console.log('   - GET /api/historical/current');
    console.log('   - GET /api/trade/contracts/market');
    console.log('\n3. 响应式页面测试:');
    console.log('   - 首页: http://localhost:' + PORT + '/');
    console.log('   - 响应式主页: http://localhost:' + PORT + '/responsive-index.html');
    console.log('   - 移动端登录: http://localhost:' + PORT + '/mobile/login');
    console.log('   - 移动端主页: http://localhost:' + PORT + '/mobile');
    console.log('   - PC端登录: http://localhost:' + PORT + '/client/login');
    console.log('\n请在浏览器中访问以上URL进行测试');
    console.log('按 Ctrl+C 停止服务器');
  });

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
      console.log('服务器已关闭');
      process.exit(0);
    });
  });
} else {
  // 在 Vercel 玎境中，只导出应用实例
  module.exports = app;
}