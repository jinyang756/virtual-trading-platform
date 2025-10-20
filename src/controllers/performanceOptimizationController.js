/**
 * 系统性能优化控制器
 */

const ApiOptimizer = require('../utils/apiOptimizer');
const CacheManager = require('../utils/cacheManager');
const LoadBalancer = require('../utils/loadBalancer');
const CdnManager = require('../utils/cdnManager');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const logger = require('../utils/logger');

// 初始化工具实例
const apiOptimizer = new ApiOptimizer();

/**
 * 获取缓存统计信息
 */
exports.getCacheStats = async (req, res) => {
  try {
    const stats = CacheManager.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('获取缓存统计信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取缓存统计信息失败: ${error.message}`);
  }
};

/**
 * 清空缓存
 */
exports.clearCache = async (req, res) => {
  try {
    CacheManager.clear();
    
    logger.info('缓存已清空', {
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '缓存已清空'
    });
  } catch (error) {
    logger.error('清空缓存失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`清空缓存失败: ${error.message}`);
  }
};

/**
 * 重置缓存统计
 */
exports.resetCacheStats = async (req, res) => {
  try {
    CacheManager.resetStats();
    
    logger.info('缓存统计已重置', {
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '缓存统计已重置'
    });
  } catch (error) {
    logger.error('重置缓存统计失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`重置缓存统计失败: ${error.message}`);
  }
};

/**
 * 获取API性能统计
 */
exports.getApiPerformanceStats = async (req, res) => {
  try {
    const stats = apiOptimizer.getPerformanceStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('获取API性能统计失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取API性能统计失败: ${error.message}`);
  }
};

/**
 * 获取系统资源使用情况
 */
exports.getSystemResources = async (req, res) => {
  try {
    const resources = apiOptimizer.getSystemResources();
    
    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    logger.error('获取系统资源使用情况失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取系统资源使用情况失败: ${error.message}`);
  }
};

/**
 * 获取负载均衡状态
 */
exports.getLoadBalancerStatus = async (req, res) => {
  try {
    const status = LoadBalancer.getServerStatus();
    const stats = LoadBalancer.getStats();
    
    res.json({
      success: true,
      data: {
        servers: status,
        stats: stats
      }
    });
  } catch (error) {
    logger.error('获取负载均衡状态失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取负载均衡状态失败: ${error.message}`);
  }
};

/**
 * 设置负载均衡策略
 */
exports.setLoadBalancerStrategy = async (req, res) => {
  try {
    const { strategy } = req.body;
    
    // 验证参数
    if (!strategy) {
      throw new ValidationError('缺少必要参数: strategy');
    }
    
    LoadBalancer.setStrategy(strategy);
    
    logger.info('负载均衡策略已更新', {
      strategy: strategy,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '负载均衡策略已更新',
      data: {
        strategy: strategy
      }
    });
  } catch (error) {
    logger.error('设置负载均衡策略失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`设置负载均衡策略失败: ${error.message}`);
  }
};

/**
 * 获取CDN统计信息
 */
exports.getCdnStats = async (req, res) => {
  try {
    const stats = CdnManager.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('获取CDN统计信息失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取CDN统计信息失败: ${error.message}`);
  }
};

/**
 * 配置CDN
 */
exports.configureCdn = async (req, res) => {
  try {
    const { config } = req.body;
    
    // 验证参数
    if (!config) {
      throw new ValidationError('缺少必要参数: config');
    }
    
    CdnManager.configure(config);
    
    logger.info('CDN配置已更新', {
      config: config,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: 'CDN配置已更新',
      data: {
        config: config
      }
    });
  } catch (error) {
    logger.error('配置CDN失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`配置CDN失败: ${error.message}`);
  }
};

/**
 * 清除CDN缓存
 */
exports.purgeCdnCache = async (req, res) => {
  try {
    const { paths } = req.body;
    
    // 验证参数
    if (!paths || !Array.isArray(paths)) {
      throw new ValidationError('缺少必要参数: paths');
    }
    
    const result = await CdnManager.purgeCache(paths);
    
    if (!result.success) {
      throw new BusinessError('清除CDN缓存失败: ' + result.error);
    }
    
    logger.info('CDN缓存清除完成', {
      paths: paths,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: 'CDN缓存清除完成',
      data: result
    });
  } catch (error) {
    logger.error('清除CDN缓存失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`清除CDN缓存失败: ${error.message}`);
  }
};

/**
 * 预加载CDN资源
 */
exports.preloadCdnResources = async (req, res) => {
  try {
    const { paths } = req.body;
    
    // 验证参数
    if (!paths || !Array.isArray(paths)) {
      throw new ValidationError('缺少必要参数: paths');
    }
    
    const result = await CdnManager.preloadResources(paths);
    
    if (!result.success) {
      throw new BusinessError('预加载CDN资源失败: ' + result.error);
    }
    
    logger.info('CDN资源预加载完成', {
      paths: paths,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: 'CDN资源预加载完成',
      data: result
    });
  } catch (error) {
    logger.error('预加载CDN资源失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`预加载CDN资源失败: ${error.message}`);
  }
};

/**
 * 检查CDN健康状态
 */
exports.checkCdnHealth = async (req, res) => {
  try {
    const health = await CdnManager.checkHealth();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('检查CDN健康状态失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`检查CDN健康状态失败: ${error.message}`);
  }
};

/**
 * 获取性能优化建议
 */
exports.getOptimizationSuggestions = async (req, res) => {
  try {
    const cacheStats = CacheManager.getStats();
    const apiStats = apiOptimizer.getPerformanceStats();
    const systemResources = apiOptimizer.getSystemResources();
    const loadBalancerStats = LoadBalancer.getStats();
    const cdnStats = CdnManager.getStats();
    
    const suggestions = [];
    
    // 缓存优化建议
    if (cacheStats.hitRate < 0.8) {
      suggestions.push({
        type: 'cache',
        priority: 'high',
        message: '缓存命中率较低，建议优化缓存策略',
        recommendation: '增加缓存项数量或调整缓存过期时间'
      });
    }
    
    // 内存使用建议
    if (systemResources.memory.heapUsed > 100) { // 超过100MB
      suggestions.push({
        type: 'memory',
        priority: 'medium',
        message: '内存使用较高',
        recommendation: '检查内存泄漏或优化数据结构'
      });
    }
    
    // 负载均衡建议
    if (loadBalancerStats.unhealthyServers > 0) {
      suggestions.push({
        type: 'load-balancer',
        priority: 'high',
        message: '存在不健康的服务器',
        recommendation: '检查服务器状态或移除不健康的服务器'
      });
    }
    
    // CDN建议
    if (cdnStats.hitRate < 0.5) {
      suggestions.push({
        type: 'cdn',
        priority: 'medium',
        message: 'CDN命中率较低',
        recommendation: '检查静态资源路径配置或预加载常用资源'
      });
    }
    
    res.json({
      success: true,
      data: {
        suggestions: suggestions,
        stats: {
          cache: cacheStats,
          api: apiStats,
          system: systemResources,
          loadBalancer: loadBalancerStats,
          cdn: cdnStats
        }
      }
    });
  } catch (error) {
    logger.error('获取性能优化建议失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    throw new BusinessError(`获取性能优化建议失败: ${error.message}`);
  }
};

/**
 * 执行批量处理优化
 */
exports.batchProcessOptimization = async (req, res) => {
  try {
    const { items, processor, batchSize } = req.body;
    
    // 验证参数
    if (!items || !Array.isArray(items) || !processor) {
      throw new ValidationError('缺少必要参数: items, processor');
    }
    
    const result = await apiOptimizer.batchProcess(items, processor, batchSize);
    
    logger.info('批量处理优化完成', {
      itemCount: items.length,
      resultCount: result.length,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '批量处理优化完成',
      data: {
        result: result,
        processedCount: result.length
      }
    });
  } catch (error) {
    logger.error('批量处理优化失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`批量处理优化失败: ${error.message}`);
  }
};

/**
 * 执行并行处理优化
 */
exports.parallelProcessOptimization = async (req, res) => {
  try {
    const { items, processor, concurrency } = req.body;
    
    // 验证参数
    if (!items || !Array.isArray(items) || !processor) {
      throw new ValidationError('缺少必要参数: items, processor');
    }
    
    const result = await apiOptimizer.parallelProcess(items, processor, concurrency);
    
    logger.info('并行处理优化完成', {
      itemCount: items.length,
      resultCount: result.length,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      message: '并行处理优化完成',
      data: {
        result: result,
        processedCount: result.length
      }
    });
  } catch (error) {
    logger.error('并行处理优化失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });
    
    if (error.name === 'ValidationError' || error.name === 'BusinessError') {
      throw error;
    }
    
    throw new BusinessError(`并行处理优化失败: ${error.message}`);
  }
};