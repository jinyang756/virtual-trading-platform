const express = require('express');
const router = express.Router();
const path = require('path');
const fundRoutes = require('./funds');
const contractMarketRoutes = require('./contractMarket');
const optionMarketRoutes = require('./optionMarket');

// 首页路由 - 默认跳转到PC端
router.get('/', (req, res) => {
  res.redirect('/client/dashboard');
});

// 基金行情路由
router.use('/api/funds', fundRoutes);

// 合约行情路由
router.use('/api/contract-market', contractMarketRoutes);

// 期权行情路由
router.use('/api/option-market', optionMarketRoutes);

// 管理后台登录页面
router.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin-login.html'));
});

// 管理后台面板
router.get('/admin/panel', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin-panel.html'));
});

// PC端客户端登录页面
router.get('/client/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/client-login.html'));
});

// PC端客户端
router.get('/client/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/client-dashboard.html'));
});

// 移动端登录页面
router.get('/mobile/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile-login.html'));
});

// 移动端客户端 - 首页
router.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/index.html'));
});

// 移动端客户端 - 行情页
router.get('/mobile/market', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/market.html'));
});

// 移动端客户端 - 交易页
router.get('/mobile/trade', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/trade.html'));
});

// 移动端客户端 - 我的页面
router.get('/mobile/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/profile.html'));
});

// 移动端客户端 - 基金页面
router.get('/mobile/funds', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/funds.html'));
});

// 移动端客户端 - 合约行情页
router.get('/mobile/contract-market', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/contract-market.html'));
});

// 移动端客户端 - 期权行情页
router.get('/mobile/option-market', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/option-market.html'));
});

// 移动端行情测试页面
router.get('/mobile/market-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/market-test.html'));
});

// 移动端页面测试
router.get('/mobile/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile-test.html'));
});

// 移动端API测试
router.get('/mobile/api-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/api-test.html'));
});

// 移动端交易测试
router.get('/mobile/trade-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/trade-test.html'));
});

// 移动端基金测试页面
router.get('/mobile/fund-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/fund-test.html'));
});

// 移动端基金组件测试页面
router.get('/mobile/fund-components-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/mobile/fund-components-test.html'));
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;