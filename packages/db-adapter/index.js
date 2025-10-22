// 数据库适配器包
const { TeableConnection } = require('../../src/database/teableConnection');
const teableConfig = require('../../config/teableConfig');

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
    try {
      const { table, operation, data, recordId, params } = queryConfig;
      
      // 获取表ID
      const tableId = await this.getTableIdByName(table);
      
      switch (operation) {
        case 'select':
          return await this.teableConnection.getRecords(tableId, params || {});
          
        case 'insert':
          return await this.teableConnection.createRecord(tableId, data);
          
        case 'update':
          return await this.teableConnection.updateRecord(tableId, recordId, data);
          
        case 'delete':
          return await this.teableConnection.deleteRecord(tableId, recordId);
          
        case 'createTable':
          return await this.teableConnection.createTable(table, data.description);
          
        default:
          throw new Error(`不支持的操作: ${operation}`);
      }
    } catch (error) {
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
    return await this.executeTeableQuery({
      table: tableName,
      operation: 'createTable',
      data: { description }
    });
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