/**
 * 移动端本地存储工具
 * 用于在页面间共享数据
 */

class MobileStorage {
  constructor() {
    this.storage = window.localStorage;
  }

  /**
   * 保存数据
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  set(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('存储数据失败:', error);
      return false;
    }
  }

  /**
   * 获取数据
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = this.storage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch {
        // 如果不是JSON格式，直接返回字符串
        return value;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      return defaultValue;
    }
  }

  /**
   * 删除数据
   * @param {string} key - 键名
   */
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }

  /**
   * 获取所有键名
   * @returns {string[]} 键名数组
   */
  keys() {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('获取键名失败:', error);
      return [];
    }
  }
}

// 创建全局实例
const mobileStorage = new MobileStorage();

// 导出为全局变量
window.MobileStorage = MobileStorage;
window.mobileStorage = mobileStorage;

// 如果是模块环境，也支持模块导入
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MobileStorage, mobileStorage };
}