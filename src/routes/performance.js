const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/performanceController');

// 接收前端性能数据
router.post('/frontend', PerformanceController.recordFrontendPerformance);

// 接收用户交互性能数据
router.post('/user-interaction', PerformanceController.recordUserInteraction);

// 获取前端性能报告
router.get('/frontend-report', PerformanceController.getFrontendPerformanceReport);

// 获取用户交互性能报告
router.get('/user-interaction-report', PerformanceController.getUserInteractionReport);

module.exports = router;