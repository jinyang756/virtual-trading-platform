const dbAdapter = require('../database/dbAdapter');

/**
 * Teable数据库管理控制器
 * 提供Teable数据库的管理接口
 */
class AdminController {
  constructor() {
    this.dbAdapter = dbAdapter;
    
    // 绑定方法上下文
    this.testConnection = this.testConnection.bind(this);
    this.getAllTables = this.getAllTables.bind(this);
    this.createTable = this.createTable.bind(this);
    this.getTableRecords = this.getTableRecords.bind(this);
    this.createRecord = this.createRecord.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  /**
   * 测试数据库连接
   */
  async testConnection(req, res) {
    try {
      const result = await this.dbAdapter.testConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '数据库连接测试失败',
        error: error.message
      });
    }
  }

  /**
   * 获取所有表
   */
  async getAllTables(req, res) {
    try {
      const tables = await this.dbAdapter.getTables();
      res.json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取表列表失败',
        error: error.message
      });
    }
  }

  /**
   * 创建表
   */
  async createTable(req, res) {
    try {
      const { tableName, description } = req.body;
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          message: '表名不能为空'
        });
      }
      
      const result = await this.dbAdapter.createTable(tableName, description || '');
      res.json({
        success: true,
        message: '表创建成功',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '创建表失败',
        error: error.message
      });
    }
  }

  /**
   * 获取表记录
   */
  async getTableRecords(req, res) {
    try {
      const { tableName } = req.params;
      const { take, skip, filter } = req.query;
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          message: '表名不能为空'
        });
      }
      
      // 通过适配器获取表ID
      const tableId = await this.dbAdapter.getTableIdByName(tableName);
      
      const params = {};
      if (take) params.take = parseInt(take);
      if (skip) params.skip = parseInt(skip);
      if (filter) params.filter = filter;
      
      const records = await this.dbAdapter.teableConnection.getRecords(tableId, params);
      res.json({
        success: true,
        data: records
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取记录失败',
        error: error.message
      });
    }
  }

  /**
   * 创建记录
   */
  async createRecord(req, res) {
    try {
      const { tableName, recordData } = req.body;
      
      if (!tableName || !recordData) {
        return res.status(400).json({
          success: false,
          message: '表名和记录数据不能为空'
        });
      }
      
      // 通过适配器获取表ID
      const tableId = await this.dbAdapter.getTableIdByName(tableName);
      
      const result = await this.dbAdapter.teableConnection.createRecord(tableId, recordData);
      res.json({
        success: true,
        message: '记录创建成功',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '创建记录失败',
        error: error.message
      });
    }
  }

  /**
   * 更新记录
   */
  async updateRecord(req, res) {
    try {
      const { tableName, recordId, recordData } = req.body;
      
      if (!tableName || !recordId || !recordData) {
        return res.status(400).json({
          success: false,
          message: '表名、记录ID和记录数据不能为空'
        });
      }
      
      // 通过适配器获取表ID
      const tableId = await this.dbAdapter.getTableIdByName(tableName);
      
      const result = await this.dbAdapter.teableConnection.updateRecord(tableId, recordId, recordData);
      res.json({
        success: true,
        message: '记录更新成功',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '更新记录失败',
        error: error.message
      });
    }
  }

  /**
   * 删除记录
   */
  async deleteRecord(req, res) {
    try {
      const { tableName, recordId } = req.body;
      
      if (!tableName || !recordId) {
        return res.status(400).json({
          success: false,
          message: '表名和记录ID不能为空'
        });
      }
      
      // 通过适配器获取表ID
      const tableId = await this.dbAdapter.getTableIdByName(tableName);
      
      const result = await this.dbAdapter.teableConnection.deleteRecord(tableId, recordId);
      res.json({
        success: true,
        message: '记录删除成功',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '删除记录失败',
        error: error.message
      });
    }
  }
}

// 创建控制器实例
const adminController = new AdminController();

module.exports = adminController;