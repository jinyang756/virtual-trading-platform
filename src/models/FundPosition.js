const { executeQuery } = require('../database/connection');
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
    const query = `
      INSERT INTO fund_positions 
      (id, user_id, fund_id, shares, avg_nav, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.fundId,
      this.shares,
      this.avgNav,
      this.timestamp
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存基金持仓失败: ${error.message}`);
    }
  }

  // 更新持仓
  async update(shares, avgNav) {
    const query = `
      UPDATE fund_positions 
      SET shares = ?, avg_nav = ?, timestamp = NOW()
      WHERE id = ?
    `;
    const values = [shares, avgNav, this.id];

    try {
      const result = await executeQuery(query, values);
      this.shares = shares;
      this.avgNav = avgNav;
      this.timestamp = new Date();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新基金持仓失败: ${error.message}`);
    }
  }

  // 根据ID查找持仓
  static async findById(id) {
    const query = 'SELECT * FROM fund_positions WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID和基金ID查找持仓
  static async findByUserAndFund(userId, fundId) {
    const query = 'SELECT * FROM fund_positions WHERE user_id = ? AND fund_id = ?';
    
    try {
      const results = await executeQuery(query, [userId, fundId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找所有持仓
  static async findByUserId(userId) {
    const query = 'SELECT * FROM fund_positions WHERE user_id = ?';
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 删除持仓
  static async delete(id) {
    const query = 'DELETE FROM fund_positions WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`删除基金持仓失败: ${error.message}`);
    }
  }
}

module.exports = FundPosition;