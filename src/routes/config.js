const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// 获取配置
router.get('/', configController.getConfig);

// 更新配置
router.put('/', configController.updateConfig);

// 获取特定配置项
router.get('/:key', configController.getConfigItem);

// 更新特定配置项
router.put('/:key', configController.updateConfigItem);

module.exports = router;