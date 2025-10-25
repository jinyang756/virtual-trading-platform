const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// 收集性能数据
router.post('/metrics/performance', (req, res) => {
  performanceController.collectMetrics(req, res);
});

// 获取性能报告
router.get('/metrics/performance/report', (req, res) => {
  performanceController.getPerformanceReport(req, res);
});

module.exports = router;