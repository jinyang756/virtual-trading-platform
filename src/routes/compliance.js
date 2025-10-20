/**
 * 合规性路由
 */

const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorization');

// KYC路由
router.post('/kyc/perform', authenticate, complianceController.performKYC);
router.get('/status', authenticate, complianceController.getComplianceStatus);

// AML路由
router.post('/aml/check', authenticate, complianceController.performAMLCheck);

// 交易合规性监控路由
router.post('/transaction/monitor', authenticate, complianceController.monitorTransactionCompliance);

// 数据隐私保护路由
router.post('/privacy/enforce', authenticate, complianceController.enforceDataPrivacy);
router.post('/privacy/consent', authenticate, complianceController.updateDataPrivacyConsent);

module.exports = router;