const axios = require('axios');
const teableConfig = require('../../config/teableConfig');

class TeableConnection {
  constructor() {
    this.apiBase = teableConfig.teable.apiBase;
    this.baseId = teableConfig.teable.baseId;
    this.apiToken = teableConfig.teable.apiToken;
    this.tables = teableConfig.teable.tables;
    
    // 创建axios实例
    this.client = axios.create({
      baseURL: `${this.apiBase}/api/base/${this.baseId}`,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 获取表记录
   * @param {string} tableName - 表名
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 查询结果
   */
  async getRecords(tableName, params = {}) {
    try {
      // 首先获取表ID
      const tableId = await this.getTableIdByName(tableName);
      
      const response = await this.client.get(`/table/${tableId}/record`, { params });
      return response.data;
    } catch (error) {
      throw new Error(`获取记录失败: ${error.message}`);
    }
  }

  /**
   * 创建记录
   * @param {string} tableName - 表名
   * @param {Object} recordData - 记录数据
   * @returns {Promise<Object>} 创建结果
   */
  async createRecord(tableName, recordData) {
    try {
      // 首先获取表ID
      const tableId = await this.getTableIdByName(tableName);
      
      const response = await this.client.post(`/table/${tableId}/record`, {
        fieldKeyType: 'name',
        records: [{
          fields: recordData
        }]
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`创建记录失败: ${error.message}`);
    }
  }

  /**
   * 更新记录
   * @param {string} tableName - 表名
   * @param {string} recordId - 记录ID
   * @param {Object} recordData - 记录数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateRecord(tableName, recordId, recordData) {
    try {
      // 首先获取表ID
      const tableId = await this.getTableIdByName(tableName);
      
      const response = await this.client.patch(`/table/${tableId}/record/${recordId}`, {
        fieldKeyType: 'name',
        record: {
          fields: recordData
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`更新记录失败: ${error.message}`);
    }
  }

  /**
   * 删除记录
   * @param {string} tableName - 表名
   * @param {string} recordId - 记录ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteRecord(tableName, recordId) {
    try {
      // 首先获取表ID
      const tableId = await this.getTableIdByName(tableName);
      
      const response = await this.client.delete(`/table/${tableId}/record/${recordId}`);
      return response.data;
    } catch (error) {
      throw new Error(`删除记录失败: ${error.message}`);
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
      if (this.tables && this.tables[tableName]) {
        return this.tables[tableName];
      }
      
      // 获取所有表信息
      const tables = await this.getTables();
      
      // 查找匹配的表
      const table = tables.find(t => t.name === tableName);
      if (!table) {
        throw new Error(`表 ${tableName} 不存在`);
      }
      
      // 缓存表ID
      if (this.tables) {
        this.tables[tableName] = table.id;
      }
      
      return table.id;
    } catch (error) {
      throw new Error(`获取表ID失败: ${error.message}`);
    }
  }

  /**
   * 创建表
   * @param {string} tableName - 表名
   * @param {string} description - 表描述
   * @returns {Promise<Object>} 创建结果
   */
  async createTable(tableName, description) {
    try {
      const response = await this.client.post('/table', {
        name: tableName,
        description: description
      });
      
      // 更新表ID映射
      if (this.tables) {
        this.tables[tableName] = response.data.id;
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`创建表失败: ${error.message}`);
    }
  }

  /**
   * 获取所有表
   * @returns {Promise<Object>} 表列表
   */
  async getTables() {
    try {
      const response = await this.client.get('/table');
      return response.data;
    } catch (error) {
      throw new Error(`获取表列表失败: ${error.message}`);
    }
  }

  /**
   * 测试连接
   * @returns {Promise<Object>} 测试结果
   */
  async testConnection() {
    try {
      // 尝试获取表列表来测试连接
      const tables = await this.getTables();
      return {
        success: true,
        message: 'Teable数据库连接成功',
        data: {
          tableCount: tables.length,
          tables: tables.map(t => ({ id: t.id, name: t.name }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Teable数据库连接失败: ${error.message}`,
        error: error.message
      };
    }
  }
}

// 创建单例实例
const teableConnection = new TeableConnection();

module.exports = teableConnection;