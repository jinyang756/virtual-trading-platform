/**
 * Teable API 客户端封装
 * 提供统一的数据库操作接口
 */

const axios = require('axios');
const config = require('../../config/teableConfig');

class TeableClient {
  constructor() {
    this.apiBase = config.teable.apiBase;
    this.baseId = config.teable.baseId;
    this.apiToken = config.teable.apiToken;
    this.tables = config.teable.tables;
    
    // 创建 Axios 实例
    this.client = axios.create({
      baseURL: this.apiBase,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 创建记录
   * @param {string} tableName - 表名
   * @param {object} recordData - 记录数据
   * @returns {Promise<object>} 创建的记录
   */
  async createRecord(tableName, recordData) {
    try {
      const tableId = this.tables[tableName];
      if (!tableId) {
        throw new Error(`表 ${tableName} 未配置`);
      }

      const response = await this.client.post(
        `/api/base/${this.baseId}/table/${tableId}/record`,
        {
          fieldKeyType: 'name',
          records: [{
            fields: recordData
          }]
        }
      );

      return response.data.records[0];
    } catch (error) {
      console.error(`创建记录失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 批量创建记录
   * @param {string} tableName - 表名
   * @param {array} recordsData - 记录数据数组
   * @returns {Promise<object>} 创建的记录
   */
  async createRecords(tableName, recordsData) {
    try {
      const tableId = this.tables[tableName];
      if (!tableId) {
        throw new Error(`表 ${tableName} 未配置`);
      }

      const response = await this.client.post(
        `/api/base/${this.baseId}/table/${tableId}/record`,
        {
          fieldKeyType: 'name',
          records: recordsData.map(data => ({ fields: data }))
        }
      );

      return response.data.records;
    } catch (error) {
      console.error(`批量创建记录失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 查询记录
   * @param {string} tableName - 表名
   * @param {object} query - 查询参数
   * @returns {Promise<object>} 查询结果
   */
  async getRecords(tableName, query = {}) {
    try {
      const tableId = this.tables[tableName];
      if (!tableId) {
        throw new Error(`表 ${tableName} 未配置`);
      }

      const params = {
        fieldKeyType: 'name',
        ...query
      };

      const response = await this.client.get(
        `/api/base/${this.baseId}/table/${tableId}/record`,
        { params }
      );

      return response.data;
    } catch (error) {
      console.error(`查询记录失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新记录
   * @param {string} tableName - 表名
   * @param {string} recordId - 记录ID
   * @param {object} recordData - 更新数据
   * @returns {Promise<object>} 更新的记录
   */
  async updateRecord(tableName, recordId, recordData) {
    try {
      const tableId = this.tables[tableName];
      if (!tableId) {
        throw new Error(`表 ${tableName} 未配置`);
      }

      const response = await this.client.patch(
        `/api/base/${this.baseId}/table/${tableId}/record/${recordId}`,
        {
          fieldKeyType: 'name',
          record: {
            fields: recordData
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(`更新记录失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除记录
   * @param {string} tableName - 表名
   * @param {string} recordId - 记录ID
   * @returns {Promise<object>} 删除结果
   */
  async deleteRecord(tableName, recordId) {
    try {
      const tableId = this.tables[tableName];
      if (!tableId) {
        throw new Error(`表 ${tableName} 未配置`);
      }

      const response = await this.client.delete(
        `/api/base/${this.baseId}/table/${tableId}/record/${recordId}`
      );

      return response.data;
    } catch (error) {
      console.error(`删除记录失败: ${error.message}`);
      throw error;
    }
  }
}

// 导出单例实例
module.exports = new TeableClient();