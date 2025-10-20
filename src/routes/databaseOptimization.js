/**
 * 数据库优化路由
 */

const express = require('express');
const router = express.Router();
const databaseOptimizationController = require('../controllers/databaseOptimizationController');

// 数据库备份相关路由
router.post('/backup', databaseOptimizationController.createBackup);
router.post('/backup/restore', databaseOptimizationController.restoreBackup);
router.get('/backup/list', databaseOptimizationController.getBackupList);
router.post('/backup/delete', databaseOptimizationController.deleteBackup);

// 数据库监控相关路由
router.get('/health', databaseOptimizationController.checkDatabaseHealth);
router.get('/stats', databaseOptimizationController.getDatabaseStats);

// 索引优化相关路由
router.post('/index/optimize', databaseOptimizationController.optimizeTableIndexes);
router.post('/index/optimize-all', databaseOptimizationController.optimizeAllTables);
router.get('/index/advice', databaseOptimizationController.getIndexPerformanceAdvice);

// 读写分离相关路由
router.get('/connection/test', databaseOptimizationController.testDatabaseConnections);
router.get('/connection/status', databaseOptimizationController.getConnectionStatus);

// 自动备份路由
router.post('/backup/auto', databaseOptimizationController.autoBackup);

module.exports = router;