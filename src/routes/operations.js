const express = require('express');
const router = express.Router();
const OperationsController = require('../controllers/operationsController');

// 服务控制路由
router.post('/start', OperationsController.startService);
router.post('/restart', OperationsController.restartService);
router.get('/logs', OperationsController.viewLogs);

// 系统维护路由
router.post('/reload-nginx', OperationsController.reloadNginx);
router.post('/renew-cert', OperationsController.renewCertificate);
router.post('/diagnose', OperationsController.runDiagnosis);
router.post('/auto-fix', OperationsController.runAutoFix);

// 状态检查路由
router.get('/health', OperationsController.getHealthStatus);
router.get('/cert-status', OperationsController.getCertStatus);
router.get('/process-status', OperationsController.getProcessStatus);

module.exports = router;