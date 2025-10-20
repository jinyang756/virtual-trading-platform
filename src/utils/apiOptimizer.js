/**
 * API响应时间优化工具
 */

const logger = require('./logger');
const cacheManager = require('./cacheManager');

class ApiOptimizer {
  constructor() {
    this.optimizationRules = {
      // 响应时间阈值（毫秒）
      responseTimeThreshold: 1000,
      // 缓存时间（毫秒）
      cacheTTL: 30000, // 30秒
      // 慢查询阈值（毫秒）
      slowQueryThreshold: 500
    };
  }

  /**
   * 测量函数执行时间
   * @param {Function} fn - 要测量的函数
   * @param {string} name - 函数名称
   * @returns {Promise<any>} 函数执行结果
   */
  async measureExecutionTime(fn, name) {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      logger.debug('函数执行时间', {
        name: name,
        executionTime: executionTime,
        timestamp: new Date().toISOString()
      });
      
      // 如果执行时间超过阈值，记录警告
      if (executionTime > this.optimizationRules.responseTimeThreshold) {
        logger.warn('函数执行时间过长', {
          name: name,
          executionTime: executionTime,
          threshold: this.optimizationRules.responseTimeThreshold
        });
      }
      
      return {
        result: result,
        executionTime: executionTime,
        success: true
      };
    } catch (error) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      logger.error('函数执行失败', {
        name: name,
        executionTime: executionTime,
        error: error.message,
        stack: error.stack
      });
      
      return {
        result: null,
        executionTime: executionTime,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 缓存包装器
   * @param {Function} fn - 要缓存的函数
   * @param {string} cacheKey - 缓存键
   * @param {number} ttl - 缓存时间（毫秒）
   * @returns {Promise<any>} 函数执行结果
   */
  async withCache(fn, cacheKey, ttl = null) {
    // 检查缓存
    const cachedResult = cacheManager.get(cacheKey);
    if (cachedResult !== undefined) {
      logger.debug('缓存命中', {
        cacheKey: cacheKey
      });
      return cachedResult;
    }
    
    // 执行函数并缓存结果
    const result = await fn();
    const cacheTTL = ttl || this.optimizationRules.cacheTTL;
    
    cacheManager.set(cacheKey, result, cacheTTL);
    
    logger.debug('结果已缓存', {
      cacheKey: cacheKey,
      ttl: cacheTTL
    });
    
    return result;
  }

  /**
   * 批量处理优化
   * @param {Array} items - 要处理的项目数组
   * @param {Function} processor - 处理函数
   * @param {number} batchSize - 批量大小
   * @returns {Promise<Array>} 处理结果数组
   */
  async batchProcess(items, processor, batchSize = 10) {
    const results = [];
    
    // 分批处理
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(item => processor(item));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        logger.debug('批量处理完成', {
          batchIndex: i / batchSize,
          batchSize: batch.length,
          totalItems: items.length
        });
      } catch (error) {
        logger.error('批量处理失败', {
          batchIndex: i / batchSize,
          error: error.message,
          stack: error.stack
        });
        
        // 继续处理下一个批次
      }
    }
    
    return results;
  }

  /**
   * 并行处理优化
   * @param {Array} items - 要处理的项目数组
   * @param {Function} processor - 处理函数
   * @param {number} concurrency - 并发数
   * @returns {Promise<Array>} 处理结果数组
   */
  async parallelProcess(items, processor, concurrency = 5) {
    const results = [];
    const executing = [];
    
    for (const item of items) {
      const promise = processor(item).then(result => {
        results.push(result);
      });
      
      executing.push(promise);
      
      // 限制并发数
      if (executing.length >= concurrency) {
        await Promise.race(executing);
        // 移除已完成的Promise
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }
    
    // 等待所有任务完成
    await Promise.all(executing);
    
    return results;
  }

  /**
   * 数据库查询优化
   * @param {Function} queryFn - 查询函数
   * @param {string} queryName - 查询名称
   * @returns {Promise<any>} 查询结果
   */
  async optimizedQuery(queryFn, queryName) {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      logger.debug('数据库查询完成', {
        queryName: queryName,
        queryTime: queryTime,
        timestamp: new Date().toISOString()
      });
      
      // 如果查询时间过长，记录警告
      if (queryTime > this.optimizationRules.slowQueryThreshold) {
        logger.warn('慢查询检测', {
          queryName: queryName,
          queryTime: queryTime,
          threshold: this.optimizationRules.slowQueryThreshold
        });
      }
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      logger.error('数据库查询失败', {
        queryName: queryName,
        queryTime: queryTime,
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }

  /**
   * API响应时间监控
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一步函数
   */
  responseTimeMiddleware(req, res, next) {
    const startTime = Date.now();
    
    // 监听响应完成事件
    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      logger.debug('API响应时间', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      });
      
      // 如果响应时间过长，记录警告
      if (responseTime > this.optimizationRules.responseTimeThreshold) {
        logger.warn('API响应时间过长', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime: responseTime,
          threshold: this.optimizationRules.responseTimeThreshold
        });
      }
    });
    
    next();
  }

  /**
   * 数据预取优化
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一步函数
   */
  prefetchMiddleware(req, res, next) {
    // 在这里可以实现数据预取逻辑
    // 例如：根据用户行为预测可能需要的数据并提前加载到缓存中
    
    next();
  }

  /**
   * 压缩响应数据
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一步函数
   */
  compressionMiddleware(req, res, next) {
    // 这里可以实现响应数据压缩逻辑
    // 例如：对JSON响应进行压缩以减少传输时间
    
    next();
  }

  /**
   * 获取性能统计
   * @returns {Object} 性能统计信息
   */
  getPerformanceStats() {
    const cacheStats = cacheManager.getStats();
    
    return {
      cache: cacheStats,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 优化数据库连接池
   * @param {Object} pool - 数据库连接池
   */
  optimizeConnectionPool(pool) {
    // 这里可以实现连接池优化逻辑
    // 例如：调整连接池大小、超时设置等
    
    logger.info('数据库连接池优化', {
      pool: pool
    });
  }

  /**
   * 内存使用监控
   * @returns {Object} 内存使用信息
   */
  getMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    
    return {
      rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100, // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
      external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100, // MB
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 系统资源监控
   * @returns {Object} 系统资源信息
   */
  getSystemResources() {
    const memoryUsage = this.getMemoryUsage();
    
    return {
      memory: memoryUsage,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiOptimizer;