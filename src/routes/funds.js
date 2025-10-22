const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');

// 获取所有基金信息
router.get('/', fundController.getAllFunds);

// 获取特定基金信息
router.get('/:fundId', fundController.getFundInfo);

// 获取基金净值历史
router.get('/:fundId/nav-history', fundController.getFundNavHistory);

// 获取基金详情
router.get('/:fundId/detail', fundController.getFundDetail);

// 获取基金市场观点
router.get('/:fundId/insights', fundController.getFundInsights);

module.exports = router;