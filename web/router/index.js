// Web路由配置文件
const express = require('express');
const router = express.Router();

// 首页路由
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../web/pages' });
});

// 基金页面路由
router.get('/funds', (req, res) => {
    res.sendFile('funds.html', { root: '../web/pages' });
});

// 合约页面路由
router.get('/contract', (req, res) => {
    res.sendFile('contract.html', { root: '../web/pages' });
});

// 期权页面路由
router.get('/option', (req, res) => {
    res.sendFile('option.html', { root: '../web/pages' });
});

module.exports = router;