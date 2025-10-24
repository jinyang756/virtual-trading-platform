const axios = require('axios');
const teableConfig = require('../../config/teableConfig');

class TeableConnection {
  constructor(apiBase, baseId, apiToken) {
    this.apiBase = apiBase || teableConfig.teable.apiBase;
    this.proxyBase = teableConfig.teable.proxyBase;
    this.baseId = baseId || teableConfig.teable.baseId;
    this.apiToken = apiToken || teableConfig.teable.apiToken;
    this.tables = teableConfig.teable.tables;
    
    // 创建管理API的axios实例（用于创建表等操作）
    this.adminClient = axios.create({
      baseURL: `${this.apiBase}/api/base/${this.baseId}`,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 创建代理API的axios实例（用于数据查询操作）
    this.proxyClient = axios.create({
      baseURL: this.proxyBase,
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
      // 使用代理执行SQL查询
      const sql = `SELECT * FROM ${tableId}`;
      const response = await this.proxyClient.post('/query', { sql });
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
      // 使用代理执行SQL插入
      const columns = Object.keys(recordData).join(', ');
      const values = Object.values(recordData).map(v => `'${v}'`).join(', ');
      const sql = `INSERT INTO ${tableId} (${columns}) VALUES (${values})`;
      const response = await this.proxyClient.post('/query', { sql });
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
      // 使用代理执行SQL更新
      const updates = Object.entries(recordData).map(([key, value]) => `${key} = '${value}'`).join(', ');
      const sql = `UPDATE ${tableId} SET ${updates} WHERE id = '${recordId}'`;
      const response = await this.proxyClient.post('/query', { sql });
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
      // 使用代理执行SQL删除
      const sql = `DELETE FROM ${tableId} WHERE id = '${recordId}'`;
      const response = await this.proxyClient.post('/query', { sql });
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
      const response = await this.adminClient.post('/table', {
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
      const response = await this.adminClient.get('/table');
      return response.data;
    } catch (error) {
      throw new Error(`获取表列表失败: ${error.message}`);
    }
  }

  /**
   * 获取表的字段信息
   * @param {string} tableId - 表ID
   * @returns {Promise<Object>} 字段列表
   */
  async getTableFields(tableId) {
    try {
      // 尝试几种可能的端点来获取字段信息
      const endpoints = [
        `/table/${tableId}/field`,
        `/table/${tableId}/fields`,
        `/field?tableId=${tableId}`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await this.adminClient.get(endpoint);
          return response.data;
        } catch (error) {
          // 如果不是最后一个端点，继续尝试下一个
          if (endpoint !== endpoints[endpoints.length - 1]) {
            continue;
          }
          // 如果是最后一个端点且仍然失败，抛出错误
          throw error;
        }
      }
      
      // 如果所有端点都失败，返回空数组
      return [];
    } catch (error) {
      console.warn(`获取表字段信息失败: ${error.message}`);
      // 返回空数组而不是抛出错误，以便脚本可以继续执行
      return [];
    }
  }

  /**
   * 更新字段描述
   * @param {string} tableId - 表ID
   * @param {string} fieldId - 字段ID
   * @param {string} description - 字段描述
   * @returns {Promise<Object>} 更新结果
   */
  async updateFieldDescription(tableId, fieldId, description) {
    try {
      const response = await this.adminClient.patch(`/table/${tableId}/field/${fieldId}`, {
        description: description
      });
      return response.data;
    } catch (error) {
      console.warn(`更新字段描述失败: ${error.message}`);
      return null;
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