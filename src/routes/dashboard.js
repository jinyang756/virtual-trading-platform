/**
 * 仪表盘路由
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 获取交易统计数据
router.get('/stats', dashboardController.getTradingStats);

// 获取资产分布数据
router.get('/assets', dashboardController.getAssetDistribution);

// 获取交易趋势数据
router.get('/trend', dashboardController.getTradingTrend);

// 获取用户排名数据
router.get('/rankings', dashboardController.getUserRankings);

// 获取仪表盘综合数据
router.get('/data', dashboardController.getDashboardData);

module.exports = router;