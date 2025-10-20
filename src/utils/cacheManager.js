/**
 * 缓存管理工具
 */

const { LRUCache } = require('lru-cache');
const logger = require('./logger');

class CacheManager {
  constructor() {
    // 创建LRU缓存实例
    this.cache = new LRUCache({
      max: 1000, // 最大缓存项数
      ttl: 1000 * 60 * 5, // 5分钟过期时间
      updateAgeOnGet: true // 获取时更新年龄
    });
    
    // 缓存统计
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {number} ttl - 过期时间（毫秒）
   */
  set(key, value, ttl = null) {
    try {
      this.cache.set(key, value, { ttl });
      this.stats.sets++;
      
      logger.debug('缓存设置成功', {
        key: key,
        ttl: ttl
      });
    } catch (error) {
      logger.error('缓存设置失败', {
        message: error.message,
        key: key
      });
    }
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存值
   */
  get(key) {
    try {
      const value = this.cache.get(key);
      
      if (value !== undefined) {
        this.stats.hits++;
        logger.debug('缓存命中', {
          key: key
        });
      } else {
        this.stats.misses++;
        logger.debug('缓存未命中', {
          key: key
        });
      }
      
      return value;
    } catch (error) {
      logger.error('缓存获取失败', {
        message: error.message,
        key: key
      });
      return undefined;
    }
  }

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   * @returns {boolean} 是否删除成功
   */
  delete(key) {
    try {
      const result = this.cache.delete(key);
      if (result) {
        this.stats.deletes++;
      }
      
      logger.debug('缓存删除成功', {
        key: key,
        result: result
      });
      
      return result;
    } catch (error) {
      logger.error('缓存删除失败', {
        message: error.message,
        key: key
      });
      return false;
    }
  }

  /**
   * 清空缓存
   */
  clear() {
    try {
      this.cache.clear();
      
      logger.info('缓存已清空');
    } catch (error) {
      logger.error('缓存清空失败', {
        message: error.message
      });
    }
  }

  /**
   * 检查缓存是否存在
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * 获取缓存大小
   * @returns {number} 缓存项数
   */
  size() {
    return this.cache.size;
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.cache.max,
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
      sets: 0,
      deletes: 0
    };
  }

  /**
   * 批量设置缓存
   * @param {Object} items - 缓存项对象
   * @param {number} ttl - 过期时间（毫秒）
   */
  setMany(items, ttl = null) {
    try {
      Object.keys(items).forEach(key => {
        this.set(key, items[key], ttl);
      });
      
      logger.debug('批量缓存设置完成', {
        count: Object.keys(items).length
      });
    } catch (error) {
      logger.error('批量缓存设置失败', {
        message: error.message
      });
    }
  }

  /**
   * 批量获取缓存
   * @param {Array} keys - 缓存键数组
   * @returns {Object} 缓存值对象
   */
  getMany(keys) {
    try {
      const result = {};
      keys.forEach(key => {
        result[key] = this.get(key);
      });
      
      return result;
    } catch (error) {
      logger.error('批量缓存获取失败', {
        message: error.message
      });
      return {};
    }
  }

  /**
   * 设置带有标签的缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {Array} tags - 标签数组
   * @param {number} ttl - 过期时间（毫秒）
   */
  setWithTag(key, value, tags, ttl = null) {
    try {
      // 设置主缓存
      this.set(key, value, ttl);
      
      // 设置标签关联
      if (tags && Array.isArray(tags)) {
        tags.forEach(tag => {
          const tagKey = `tag:${tag}`;
          const tagItems = this.get(tagKey) || [];
          if (!tagItems.includes(key)) {
            tagItems.push(key);
            this.set(tagKey, tagItems);
          }
        });
      }
      
      logger.debug('带标签缓存设置成功', {
        key: key,
        tags: tags
      });
    } catch (error) {
      logger.error('带标签缓存设置失败', {
        message: error.message,
        key: key
      });
    }
  }

  /**
   * 根据标签清除缓存
   * @param {string} tag - 标签
   */
  clearByTag(tag) {
    try {
      const tagKey = `tag:${tag}`;
      const tagItems = this.get(tagKey) || [];
      
      // 删除所有关联的缓存项
      tagItems.forEach(key => {
        this.delete(key);
      });
      
      // 删除标签本身
      this.delete(tagKey);
      
      logger.info('按标签清除缓存完成', {
        tag: tag,
        count: tagItems.length
      });
    } catch (error) {
      logger.error('按标签清除缓存失败', {
        message: error.message,
        tag: tag
      });
    }
  }

  /**
   * 获取缓存键列表
   * @returns {Array} 缓存键数组
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * 预热缓存
   * @param {Function} loader - 数据加载函数
   * @param {Array} keys - 需要预热的键
   */
  async warmup(loader, keys) {
    try {
      const promises = keys.map(async key => {
        if (!this.has(key)) {
          try {
            const data = await loader(key);
            this.set(key, data);
          } catch (error) {
            logger.warn('缓存预热失败', {
              message: error.message,
              key: key
            });
          }
        }
      });
      
      await Promise.all(promises);
      
      logger.info('缓存预热完成', {
        count: keys.length
      });
    } catch (error) {
      logger.error('缓存预热异常', {
        message: error.message
      });
    }
  }
}

// 创建单例实例
const cacheManager = new CacheManager();

module.exports = cacheManager;