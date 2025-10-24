const { TeableConnection } = require('./teableConnection');
const teableConfig = require('../../config/teableConfig');
const DatabasePerformanceMonitor = require('./dbPerformanceMonitor');

class DatabaseAdapter {
  constructor() {
    this.currentDb = 'teable';
    this.teableConnection = new TeableConnection(
      teableConfig.teable.apiBase,
      teableConfig.teable.baseId,
      teableConfig.teable.apiToken
    );
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
    // 开始监控查询性能
    const queryInfo = DatabasePerformanceMonitor.queryStart(
      `${queryConfig.operation} on ${queryConfig.table}`, 
      queryConfig.params || queryConfig.data
    );
    
    try {
      const { table, operation, data, recordId, params } = queryConfig;
      
      // 获取表ID
      const tableId = await this.getTableIdByName(table);
      
      let result;
      switch (operation) {
        case 'select':
          result = await this.teableConnection.getRecords(tableId, params || {});
          break;
          
        case 'insert':
          result = await this.teableConnection.createRecord(tableId, data);
          break;
          
        case 'update':
          result = await this.teableConnection.updateRecord(tableId, recordId, data);
          break;
          
        case 'delete':
          result = await this.teableConnection.deleteRecord(tableId, recordId);
          break;
          
        case 'createTable':
          result = await this.teableConnection.createTable(table, data.description);
          break;
          
        default:
          throw new Error(`不支持的操作: ${operation}`);
      }
      
      // 结束监控并记录性能数据
      DatabasePerformanceMonitor.queryEnd(queryInfo, result);
      
      return result;
    } catch (error) {
      // 记录错误性能数据
      DatabasePerformanceMonitor.queryEnd(queryInfo, null, error);
      throw new Error(`Teable查询执行失败: ${error.message}`);
    }
  }

  /**
   * 通过表名获取表ID
   * @param {string} tableName - 表名
   * @returns {Promise<string>} 表ID
   */
  async getTableIdByName(tableName) {
    try {
      // 如果已经在缓存中，直接返回
      if (this.teableConnection.tables && this.teableConnection.tables[tableName]) {
        return this.teableConnection.tables[tableName];
      }
      
      // 获取所有表信息
      const tables = await this.teableConnection.getTables();
      
      // 查找匹配的表
      const table = tables.find(t => t.name === tableName);
      if (!table) {
        throw new Error(`表 ${tableName} 不存在`);
      }
      
      // 缓存表ID
      if (this.teableConnection.tables) {
        this.teableConnection.tables[tableName] = table.id;
      }
      
      return table.id;
    } catch (error) {
      throw new Error(`获取表ID失败: ${error.message}`);
    }
  }

  /**
   * 获取连接
   * @returns {Object} 数据库连接
   */
  async getConnection() {
    return this.teableConnection;
  }

  /**
   * 测试数据库连接
   * @returns {Promise<Object>} 测试结果
   */
  async testConnection() {
    return await this.teableConnection.testConnection();
  }

  /**
   * 创建表
   * @param {string} tableName - 表名
   * @param {string} description - 表描述
   * @returns {Promise<Object>} 创建结果
   */
  async createTable(tableName, description) {
    // 直接调用 teableConnection 的 createTable 方法，避免通过 executeTeableQuery
    const connection = await this.getConnection();
    return await connection.createTable(tableName, description || '');
  }

  /**
   * 获取所有表
   * @returns {Promise<Object>} 表列表
   */
  async getTables() {
    const connection = await this.getConnection();
    return await connection.getTables();
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