const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// 获取市场数据
router.get('/data', marketController.getMarketData);

// 获取市场资产列表
router.get('/list', marketController.getMarketList);

// 获取特定资产价格
router.get('/price/:asset', marketController.getPrice);

// 获取市场趋势
router.get('/trend', marketController.getMarketTrend);

// 获取历史数据
router.get('/history/:asset', marketController.getHistory);

module.exports = router;