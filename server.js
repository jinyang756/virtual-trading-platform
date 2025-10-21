const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const app = require('./src/app');

// 提供额外的静态文件服务
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// 如果不是在 Vercel 环境中，则直接启动服务器
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`Virtual Trading Platform server is running on port ${PORT}`);
    console.log(`系统管理面板访问地址: http://localhost:${PORT}/admin/panel`);
    console.log(`用户端仪表板访问地址: http://localhost:${PORT}/client/dashboard`);
    console.log(`移动端客户端访问地址: http://localhost:${PORT}/mobile`);
  });

  module.exports = server;
} else {
  // 在 Vercel 环境中，只导出应用实例
  module.exports = app;
}