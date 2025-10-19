const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const contractController = require('../controllers/contractController');
const binaryController = require('../controllers/binaryController');
const fundController = require('../controllers/fundController');
const portfolioController = require('../controllers/portfolioController');

// 传统交易路由
// 创建订单
router.post('/order', tradeController.createOrder);

// 获取订单状态
router.get('/order/:id', tradeController.getOrder);

// 取消订单
router.delete('/order/:id', tradeController.cancelOrder);

// 获取用户持仓
router.get('/positions/:userId', tradeController.getPositions);

// 获取用户交易历史
router.get('/history/:userId', tradeController.getTradeHistory);

// 合约交易路由
// 获取合约市场数据
router.get('/contracts/market/:symbolId', contractController.getContractMarketData);
router.get('/contracts/market', contractController.getAllContractMarketData);

// 下合约订单
router.post('/contracts/order', contractController.placeContractOrder);

// 获取用户合约持仓
router.get('/contracts/positions/:userId', contractController.getContractUserPositions);

// 获取合约订单历史
router.get('/contracts/history/:userId', contractController.getContractOrderHistory);

// 获取合约价格历史
router.get('/contracts/price/:symbolId', contractController.getContractPriceHistory);

// 计算合约投资组合价值
router.get('/contracts/portfolio/:userId', contractController.calculateContractPortfolioValue);

// 二元期权路由
// 获取二元期权策略
router.get('/binary/strategies', binaryController.getBinaryStrategies);

// 获取当前市场趋势
router.get('/binary/trend', binaryController.getCurrentTrend);

// 下二元期权订单
router.post('/binary/order', binaryController.placeBinaryOrder);

// 获取用户活跃订单
router.get('/binary/active/:userId', binaryController.getBinaryActiveOrders);

// 获取二元期权订单历史
router.get('/binary/history/:userId', binaryController.getBinaryOrderHistory);

// 获取二元期权历史统计（注意：这个路由必须在获取用户统计之前定义）
router.get('/binary/stats/history', binaryController.getBinaryHistoricalStatistics);

// 获取二元期权统计
router.get('/binary/stats/:userId', binaryController.getBinaryStatistics);

// 私募基金路由
// 获取基金信息
router.get('/funds/:fundId', fundController.getFundInfo);
router.get('/funds', fundController.getAllFunds);

// 认购基金
router.post('/funds/subscribe', fundController.subscribeFund);

// 赎回基金
router.post('/funds/redeem', fundController.redeemFund);

// 获取用户基金持仓
router.get('/funds/positions/:userId', fundController.getFundUserPositions);

// 获取基金交易历史
router.get('/funds/history/:userId', fundController.getFundTransactionHistory);

// 获取基金净值历史
router.get('/funds/nav/:fundId', fundController.getFundNavHistory);

// 计算基金表现
router.get('/funds/performance/:fundId', fundController.calculateFundPerformance);

// 综合路由
// 获取所有市场数据
router.get('/market/all', portfolioController.getAllMarketData);

// 获取用户综合投资组合
router.get('/portfolio/:userId', portfolioController.getUserPortfolio);

// 获取用户所有持仓
router.get('/positions/all/:userId', portfolioController.getUserAllPositions);

// 获取用户所有订单历史
router.get('/history/all/:userId', portfolioController.getUserAllOrderHistory);

module.exports = router;