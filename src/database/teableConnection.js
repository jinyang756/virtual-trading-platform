const axios = require('axios');
const teableConfig = require('../../config/teableConfig');

class TeableConnection {
  constructor(apiBase, baseId, apiToken) {
    this.apiBase = apiBase || teableConfig.teable.apiBase;
    this.baseId = baseId || teableConfig.teable.baseId;
    this.apiToken = apiToken || teableConfig.teable.apiToken;
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
   * @param {string} tableId - 表ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 查询结果
   */
  async getRecords(tableId, params = {}) {
    try {
      const response = await this.client.get(`/table/${tableId}/record`, { params });
      return response.data;
    } catch (error) {
      throw new Error(`获取记录失败: ${error.message}`);
    }
  }

  /**
   * 创建记录
   * @param {string} tableId - 表ID
   * @param {Object} recordData - 记录数据
   * @returns {Promise<Object>} 创建结果
   */
  async createRecord(tableId, recordData) {
    try {
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
   * @param {string} tableId - 表ID
   * @param {string} recordId - 记录ID
   * @param {Object} recordData - 记录数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateRecord(tableId, recordId, recordData) {
    try {
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
   * @param {string} tableId - 表ID
   * @param {string} recordId - 记录ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteRecord(tableId, recordId) {
    try {
      const response = await this.client.delete(`/table/${tableId}/record/${recordId}`);
      return response.data;
    } catch (error) {
      throw new Error(`删除记录失败: ${error.message}`);
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
      console.log(`尝试创建表: ${tableName}, 描述: ${description}`);
      const response = await this.client.post('/table', {
        name: tableName,
        description: description
      });
      
      console.log(`创建表响应:`, response.data);
      
      // 更新表ID映射
      if (this.tables) {
        this.tables[tableName] = response.data.id;
      }
      
      return response.data;
    } catch (error) {
      console.error(`创建表失败:`, error.response ? error.response.data : error.message);
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

module.exports = { TeableConnection };