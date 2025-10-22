const express = require('express');
const cors = require('cors');
const config = require('../../config');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(config.publicPath));

// 路由
const adminRoutes = require('../../src/routes/adminRoutes');
const usersRoutes = require('../../src/routes/users');
const tradeRoutes = require('../../src/routes/trade');
const mobileRoutes = require('../../src/routes/index');
const fundRoutes = require('../../src/routes/funds');

app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/fund', fundRoutes);
app.use('/', mobileRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: config.publicPath });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 如果不是在特定云环境，则直接启动服务器
if (!process.env.CLOUD_ENV) {
  const PORT = process.env.PORT || 3001;
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`Fund Server is running on port ${PORT}`);
    console.log(`基金行情页面访问地址: http://localhost:${PORT}/funds`);
  });

  module.exports = server;
} else {
  // 在云环境中，只导出应用实例
  module.exports = app;
}