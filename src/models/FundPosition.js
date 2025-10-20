const dbAdapter = require('../database/dbAdapter');
const { generateId } = require('../utils/codeGenerator');

class FundPosition {
  constructor(id, userId, fundId, shares, avgNav) {
    this.id = id || generateId();
    this.userId = userId;
    this.fundId = fundId;
    this.shares = shares;
    this.avgNav = avgNav;
    this.timestamp = new Date();
  }

  // 保存持仓到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          fund_id: this.fundId,
          shares: this.shares,
          avg_nav: this.avgNav,
          timestamp: this.timestamp
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存基金持仓失败: ${error.message}`);
    }
  }

  // 更新持仓
  async update(shares, avgNav) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'update',
        recordId: this.id,
        data: {
          shares: shares,
          avg_nav: avgNav,
          timestamp: new Date()
        }
      });
      
      this.shares = shares;
      this.avgNav = avgNav;
      this.timestamp = new Date();
      return result !== null;
    } catch (error) {
      throw new Error(`更新基金持仓失败: ${error.message}`);
    }
  }

  // 根据ID查找持仓
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'select',
        params: {
          filter: `id = '${id}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID和基金ID查找持仓
  static async findByUserAndFund(userId, fundId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND fund_id = '${fundId}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找所有持仓
  static async findByUserId(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 删除持仓
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_positions',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw new Error(`删除基金持仓失败: ${error.message}`);
    }
  }
}

module.exports = FundPosition;