const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 用户管理路由
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// 交易管理路由
router.get('/trades', adminController.getTrades);
router.put('/trades/:id/status', adminController.updateTradeStatus);

// 系统统计路由
router.get('/stats', adminController.getSystemStats);

// 资金管理路由
router.get('/funds', adminController.getFunds);
router.post('/funds/adjust', adminController.adjustFunds);

module.exports = router;