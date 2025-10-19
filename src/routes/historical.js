const express = require('express');
const router = express.Router();
const historicalDataController = require('../controllers/historicalDataController');

// 获取所有资产的历史数据
router.get('/data', historicalDataController.getAllHistoricalData);

// 获取特定资产的历史数据
router.get('/data/:asset', historicalDataController.getAssetHistoricalData);

// 获取特定时间范围的历史数据
router.get('/data/:asset/range', historicalDataController.getHistoricalDataByDateRange);

// 获取当前市场数据
router.get('/current', historicalDataController.getCurrentMarketData);

module.exports = router;