/**
 * 数据分析和可视化功能路由
 */

const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 交易数据分析路由
router.get('/trade/:userId', analysisController.getTradeAnalysis);

// 投资组合分析路由
router.get('/portfolio/:userId', analysisController.getPortfolioAnalysis);

// 收益风险分析路由
router.get('/risk/:userId', analysisController.getRiskAnalysis);

// 市场趋势预测路由
router.get('/prediction/:symbol', analysisController.getMarketPrediction);
router.get('/prediction', analysisController.getPredictionComparison);

// 热门资产分析路由
router.get('/popular', analysisController.getPopularAssets);

// 分析报告导出路由
router.post('/export', analysisController.exportAnalysisReport);

module.exports = router;