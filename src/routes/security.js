/**
 * 安全路由
 */

const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorization');

// 双因素认证路由
router.post('/2fa/generate', authenticate, securityController.generate2FASecret);
router.post('/2fa/verify', authenticate, securityController.verify2FAToken);
router.post('/2fa/disable', authenticate, securityController.disable2FA);
router.post('/2fa/verify-login', securityController.verifyLogin2FAToken);

// IP白名单路由
router.post('/ip-whitelist/add', authenticate, securityController.addIPToWhitelist);
router.post('/ip-whitelist/remove', authenticate, securityController.removeIPFromWhitelist);
router.get('/ip-whitelist', authenticate, securityController.getIPWhitelist);

// 数据加密路由
router.post('/encryption/enhance', authenticate, requireRole(['admin']), securityController.enhanceDataEncryption);

// 安全审计路由
router.post('/audit/perform', authenticate, requireRole(['admin']), securityController.performSecurityAudit);

module.exports = router;