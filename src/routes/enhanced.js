/**
 * 扩展功能路由
 */

const express = require('express');
const router = express.Router();
const enhancedFeaturesController = require('../controllers/enhancedFeaturesController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorization');

// 金融产品管理路由
router.post('/products', authenticate, requireRole(['admin']), enhancedFeaturesController.addFinancialProduct);
router.get('/products', authenticate, requireRole(['admin']), enhancedFeaturesController.getFinancialProducts);
router.put('/products', authenticate, requireRole(['admin']), enhancedFeaturesController.updateFinancialProduct);

// 多币种支持路由
router.post('/currencies', authenticate, requireRole(['admin']), enhancedFeaturesController.addCurrencySupport);
router.get('/currencies', authenticate, requireRole(['admin']), enhancedFeaturesController.getSupportedCurrencies);
router.put('/currencies/rate', authenticate, requireRole(['admin']), enhancedFeaturesController.updateExchangeRate);

// 第三方API接口路由
router.post('/api-interfaces', authenticate, requireRole(['admin']), enhancedFeaturesController.createThirdPartyApi);
router.get('/api-interfaces', authenticate, requireRole(['admin']), enhancedFeaturesController.getApiInterfaces);
router.put('/api-interfaces', authenticate, requireRole(['admin']), enhancedFeaturesController.updateApiInterface);

// 插件化架构路由
router.post('/plugins', authenticate, requireRole(['admin']), enhancedFeaturesController.implementPluginArchitecture);
router.get('/plugins', authenticate, requireRole(['admin']), enhancedFeaturesController.getInstalledPlugins);
router.put('/plugins', authenticate, requireRole(['admin']), enhancedFeaturesController.updatePluginConfig);

module.exports = router;