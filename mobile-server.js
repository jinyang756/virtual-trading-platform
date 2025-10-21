const express = require('express');
const path = require('path');

const app = express();

// 提供移动端静态文件服务
app.use(express.static(path.join(__dirname, 'public/mobile')));

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'mobile-client'
  });
});

// 所有路由都返回移动端首页，支持前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mobile/index.html'));
});

// 如果不是在 Vercel 环境中，则直接启动服务器
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3002;
  
  const server = app.listen(PORT, () => {
    console.log(`Mobile client server is running on port ${PORT}`);
    console.log(`Access mobile client at: http://localhost:${PORT}`);
  });

  module.exports = server;
} else {
  // 在 Vercel 环境中，只导出应用实例
  module.exports = app;
}