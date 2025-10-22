const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

// 获取所有合约信息
router.get('/', contractController.getAllContractMarketData);

// 获取特定合约信息
router.get('/:symbolId', contractController.getContractMarketData);

// 获取合约K线数据
router.get('/:symbolId/kline', contractController.getContractPriceHistory);

// 获取合约详情
router.get('/:symbolId/detail', (req, res) => {
  // 这里可以添加获取合约详情的逻辑
  res.json({ message: '获取合约详情接口' });
});

// 获取买卖盘数据
router.get('/:symbolId/orderbook', (req, res) => {
  // 这里可以添加获取买卖盘数据的逻辑
  res.json({ message: '获取买卖盘数据接口' });
});

module.exports = router;