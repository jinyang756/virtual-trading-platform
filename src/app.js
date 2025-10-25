const express = require('express');
const cors = require('cors');
const config = require('../config');
require('dotenv').config();

const app = express();

// 性能监控中间件
const performanceMonitor = require('./middleware/performanceMonitor');

// CORS配置
const corsOptions = {
  origin: ['https://jiuzhougroup.vip', 'https://jcstjj.top', 'http://localhost:5173', 'http://localhost:3000', 'https://your-cloudflare-subdomain.pages.dev'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-User-Id'],
  credentials: true,
  optionsSuccessStatus: 204
};

// 中间件
app.use(performanceMonitor);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(config.publicPath));

// 路由
const adminRoutes = require('./routes/adminRoutes');
const usersRoutes = require('./routes/users');
const tradeRoutes = require('./routes/trade');
const mobileRoutes = require('./routes/index');
const auditRoutes = require('./routes/audit');
const performanceRoutes = require('./routes/performance');
const monitoringRoutes = require('./routes/monitoring');
const operationsRoutes = require('./routes/operations');
const opsRoutes = require('./routes/ops');

app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/ops', opsRoutes);
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

// 导出app实例供Socket.IO使用
module.exports = app;