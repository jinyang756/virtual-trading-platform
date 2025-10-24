const express = require('express');
const router = express.Router();
const MonitoringController = require('../controllers/monitoringController');

// 获取系统性能概览数据
router.get('/overview', MonitoringController.getSystemOverview);

// 获取API性能数据
router.get('/api-performance', MonitoringController.getApiPerformance);

// 获取数据库性能数据
router.get('/db-performance', MonitoringController.getDatabasePerformance);

// 获取前端性能数据
router.get('/frontend-performance', MonitoringController.getFrontendPerformance);

// 获取监控仪表板页面
router.get('/dashboard', MonitoringController.getMonitoringDashboard);

module.exports = router;