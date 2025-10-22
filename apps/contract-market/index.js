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
const contractMarketRoutes = require('../../src/routes/contractMarket');

app.use('/api/contract-market', contractMarketRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.sendFile('contract-market.html', { root: config.publicPath });
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
  const PORT = process.env.PORT || 3002;
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`Contract Market Server is running on port ${PORT}`);
    console.log(`合约行情页面访问地址: http://localhost:${PORT}/contract-market`);
  });

  module.exports = server;
} else {
  // 在云环境中，只导出应用实例
  module.exports = app;
}