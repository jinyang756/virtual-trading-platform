const express = require('express');
const router = express.Router();
const binaryController = require('../controllers/binaryController');

// 获取所有期权合约信息
router.get('/', binaryController.getBinaryStrategies);

// 获取当前市场趋势
router.get('/trend', binaryController.getCurrentTrend);

// 获取特定期权信息
router.get('/:symbolId', (req, res) => {
  // 这里可以添加获取特定期权信息的逻辑
  res.json({ message: '获取期权信息接口' });
});

// 获取期权希腊值数据
router.get('/:symbolId/greeks', (req, res) => {
  // 这里可以添加获取希腊值数据的逻辑
  res.json({ message: '获取希腊值数据接口' });
});

// 获取期权波动率数据
router.get('/:symbolId/volatility', (req, res) => {
  // 这里可以添加获取波动率数据的逻辑
  res.json({ message: '获取波动率数据接口' });
});

// 获取期权T型报价表
router.get('/:symbolId/matrix', (req, res) => {
  // 这里可以添加获取T型报价表的逻辑
  res.json({ message: '获取T型报价表接口' });
});

module.exports = router;