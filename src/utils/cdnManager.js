/**
 * CDN管理工具
 */

const logger = require('./logger');

class CdnManager {
  constructor() {
    this.cdnConfig = {
      enabled: false,
      provider: 'cloudflare', // cloudflare, aws-cloudfront, aliyun-cdn
      baseUrl: '',
      apiKey: '',
      zoneId: '',
      // 静态资源路径映射
      staticPaths: {
        '/css/': '/css/',
        '/js/': '/js/',
        '/images/': '/images/',
        '/fonts/': '/fonts/'
      },
      // 缓存策略
      cacheRules: {
        css: 86400, // 24小时
        js: 86400, // 24小时
        images: 604800, // 7天
        fonts: 2592000 // 30天
      }
    };
    
    this.stats = {
      hits: 0,
      misses: 0,
      purged: 0
    };
  }

  /**
   * 配置CDN
   * @param {Object} config - CDN配置
   */
  configure(config) {
    this.cdnConfig = {
      ...this.cdnConfig,
      ...config
    };
    
    logger.info('CDN配置已更新', {
      provider: this.cdnConfig.provider,
      enabled: this.cdnConfig.enabled
    });
  }

  /**
   * 生成CDN URL
   * @param {string} path - 资源路径
   * @returns {string} CDN URL
   */
  generateUrl(path) {
    if (!this.cdnConfig.enabled || !this.cdnConfig.baseUrl) {
      // 如果CDN未启用，返回原始路径
      return path;
    }
    
    // 确保路径以/开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // 生成CDN URL
    const cdnUrl = this.cdnConfig.baseUrl + path;
    
    logger.debug('CDN URL生成', {
      originalPath: path,
      cdnUrl: cdnUrl
    });
    
    return cdnUrl;
  }

  /**
   * 预加载资源到CDN
   * @param {Array} paths - 资源路径数组
   * @returns {Promise<Object>} 预加载结果
   */
  async preloadResources(paths) {
    try {
      if (!this.cdnConfig.enabled) {
        return {
          success: false,
          message: 'CDN未启用'
        };
      }
      
      // 这里应该调用CDN提供商的API来预加载资源
      // 由于是模拟实现，我们只是记录日志
      
      logger.info('资源预加载到CDN', {
        paths: paths,
        count: paths.length
      });
      
      return {
        success: true,
        message: `成功预加载${paths.length}个资源`,
        paths: paths
      };
    } catch (error) {
      logger.error('CDN资源预加载失败', {
        message: error.message,
        stack: error.stack,
        paths: paths
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 清除CDN缓存
   * @param {Array} paths - 要清除的路径数组
   * @returns {Promise<Object>} 清除结果
   */
  async purgeCache(paths) {
    try {
      if (!this.cdnConfig.enabled) {
        return {
          success: false,
          message: 'CDN未启用'
        };
      }
      
      // 这里应该调用CDN提供商的API来清除缓存
      // 由于是模拟实现，我们只是记录日志
      
      this.stats.purged += paths.length;
      
      logger.info('CDN缓存清除', {
        paths: paths,
        count: paths.length
      });
      
      return {
        success: true,
        message: `成功清除${paths.length}个资源的缓存`,
        paths: paths
      };
    } catch (error) {
      logger.error('CDN缓存清除失败', {
        message: error.message,
        stack: error.stack,
        paths: paths
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取资源URL（自动选择CDN或本地）
   * @param {string} path - 资源路径
   * @returns {string} 资源URL
   */
  getResourceUrl(path) {
    // 检查是否应该使用CDN
    const shouldUseCdn = this.shouldUseCdn(path);
    
    if (shouldUseCdn) {
      this.stats.hits++;
      return this.generateUrl(path);
    } else {
      this.stats.misses++;
      return path;
    }
  }

  /**
   * 判断是否应该使用CDN
   * @param {string} path - 资源路径
   * @returns {boolean} 是否使用CDN
   */
  shouldUseCdn(path) {
    if (!this.cdnConfig.enabled) {
      return false;
    }
    
    // 检查路径是否匹配静态资源路径
    for (const staticPath in this.cdnConfig.staticPaths) {
      if (path.startsWith(staticPath)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 获取CDN统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      ...this.stats,
      enabled: this.cdnConfig.enabled,
      provider: this.cdnConfig.provider,
      baseUrl: this.cdnConfig.baseUrl,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      purged: 0
    };
    
    logger.info('CDN统计已重置');
  }

  /**
   * 获取缓存策略
   * @param {string} fileType - 文件类型
   * @returns {number} 缓存时间（秒）
   */
  getCacheTTL(fileType) {
    return this.cdnConfig.cacheRules[fileType] || 3600; // 默认1小时
  }

  /**
   * 设置缓存策略
   * @param {Object} rules - 缓存规则
   */
  setCacheRules(rules) {
    this.cdnConfig.cacheRules = {
      ...this.cdnConfig.cacheRules,
      ...rules
    };
    
    logger.info('CDN缓存规则已更新', {
      rules: rules
    });
  }

  /**
   * 获取静态路径映射
   * @returns {Object} 路径映射
   */
  getStaticPaths() {
    return this.cdnConfig.staticPaths;
  }

  /**
   * 设置静态路径映射
   * @param {Object} paths - 路径映射
   */
  setStaticPaths(paths) {
    this.cdnConfig.staticPaths = {
      ...this.cdnConfig.staticPaths,
      ...paths
    };
    
    logger.info('CDN静态路径映射已更新', {
      paths: paths
    });
  }

  /**
   * 检查CDN健康状态
   * @returns {Promise<Object>} 健康状态
   */
  async checkHealth() {
    try {
      if (!this.cdnConfig.enabled) {
        return {
          status: 'disabled',
          message: 'CDN未启用'
        };
      }
      
      // 这里应该调用CDN提供商的健康检查API
      // 由于是模拟实现，我们返回模拟状态
      
      return {
        status: 'healthy',
        provider: this.cdnConfig.provider,
        baseUrl: this.cdnConfig.baseUrl,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('CDN健康检查失败', {
        message: error.message,
        stack: error.stack
      });
      
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * 获取CDN配置信息
   * @returns {Object} 配置信息
   */
  getConfig() {
    return {
      enabled: this.cdnConfig.enabled,
      provider: this.cdnConfig.provider,
      baseUrl: this.cdnConfig.baseUrl,
      staticPaths: this.cdnConfig.staticPaths,
      cacheRules: this.cdnConfig.cacheRules
    };
  }
}

// 创建单例实例
const cdnManager = new CdnManager();

module.exports = cdnManager;