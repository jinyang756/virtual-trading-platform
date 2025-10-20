/**
 * 性能优化路由
 */

const express = require('express');
const router = express.Router();
const performanceOptimizationController = require('../controllers/performanceOptimizationController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorization');

// 缓存管理路由
router.get('/cache/stats', authenticate, requireRole(['admin']), performanceOptimizationController.getCacheStats);
router.post('/cache/clear', authenticate, requireRole(['admin']), performanceOptimizationController.clearCache);
router.post('/cache/reset-stats', authenticate, requireRole(['admin']), performanceOptimizationController.resetCacheStats);

// API性能监控路由
router.get('/api/stats', authenticate, requireRole(['admin']), performanceOptimizationController.getApiPerformanceStats);
router.get('/system/resources', authenticate, requireRole(['admin']), performanceOptimizationController.getSystemResources);

// 负载均衡路由
router.get('/load-balancer/status', authenticate, requireRole(['admin']), performanceOptimizationController.getLoadBalancerStatus);
router.post('/load-balancer/strategy', authenticate, requireRole(['admin']), performanceOptimizationController.setLoadBalancerStrategy);

// CDN管理路由
router.get('/cdn/stats', authenticate, requireRole(['admin']), performanceOptimizationController.getCdnStats);
router.post('/cdn/configure', authenticate, requireRole(['admin']), performanceOptimizationController.configureCdn);
router.post('/cdn/purge', authenticate, requireRole(['admin']), performanceOptimizationController.purgeCdnCache);
router.post('/cdn/preload', authenticate, requireRole(['admin']), performanceOptimizationController.preloadCdnResources);
router.get('/cdn/health', authenticate, requireRole(['admin']), performanceOptimizationController.checkCdnHealth);

// 性能优化建议路由
router.get('/suggestions', authenticate, requireRole(['admin']), performanceOptimizationController.getOptimizationSuggestions);

// 批量处理优化路由
router.post('/batch-process', authenticate, requireRole(['admin']), performanceOptimizationController.batchProcessOptimization);
router.post('/parallel-process', authenticate, requireRole(['admin']), performanceOptimizationController.parallelProcessOptimization);

module.exports = router;