const dbConfig = require('../../config/database');
const teableConnection = require('./teableConnection');

class DatabaseAdapter {
  constructor() {
    this.currentDb = 'teable';
    console.log(`当前使用的数据库: ${this.currentDb}`);
  }

  /**
   * 执行查询
   * @param {Object} queryConfig - Teable查询配置
   * @returns {Promise} 查询结果
   */
  async executeQuery(queryConfig) {
    // Teable查询
    return await this.executeTeableQuery(queryConfig);
  }

  /**
   * 执行Teable查询
   * @param {Object} queryConfig - 查询配置
   * @returns {Promise} 查询结果
   */
  async executeTeableQuery(queryConfig) {
    try {
      const { table, operation, data, recordId, params } = queryConfig;
      
      switch (operation) {
        case 'select':
          return await teableConnection.getRecords(table, params || {});
          
        case 'insert':
          return await teableConnection.createRecord(table, data);
          
        case 'update':
          return await teableConnection.updateRecord(table, recordId, data);
          
        case 'delete':
          return await teableConnection.deleteRecord(table, recordId);
          
        default:
          throw new Error(`不支持的操作: ${operation}`);
      }
    } catch (error) {
      throw new Error(`Teable查询执行失败: ${error.message}`);
    }
  }

  /**
   * 获取连接
   * @returns {Object} 数据库连接
   */
  async getConnection() {
    return teableConnection;
  }

  /**
   * 测试数据库连接
   * @returns {Promise<Object>} 测试结果
   */
  async testConnection() {
    return await teableConnection.testConnection();
  }

  /**
   * 切换数据库
   * @param {string} dbType - 数据库类型 ('teable')
   */
  switchDatabase(dbType) {
    if (dbType === 'teable') {
      this.currentDb = dbType;
      console.log(`数据库已切换到: ${this.currentDb}`);
    } else {
      throw new Error('不支持的数据库类型');
    }
  }

  /**
   * 获取当前数据库类型
   * @returns {string} 当前数据库类型
   */
  getCurrentDatabase() {
    return this.currentDb;
  }
}

// 创建单例实例
const dbAdapter = new DatabaseAdapter();

module.exports = dbAdapter;