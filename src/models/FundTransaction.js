const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class FundTransaction {
  constructor(id, userId, fundId, type, amount, shares, nav, fee) {
    this.id = id || generateId();
    this.userId = userId;
    this.fundId = fundId;
    this.type = type; // 'SUBSCRIBE' or 'REDEEM'
    this.amount = amount;
    this.shares = shares;
    this.nav = nav;
    this.fee = fee;
    this.timestamp = new Date();
  }

  // 保存交易记录到数据库
  async save() {
    const query = `
      INSERT INTO fund_transactions 
      (id, user_id, fund_id, type, amount, shares, nav, fee, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.fundId,
      this.type,
      this.amount,
      this.shares,
      this.nav,
      this.fee,
      this.timestamp
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存基金交易记录失败: ${error.message}`);
    }
  }

  // 根据ID查找交易记录
  static async findById(id) {
    const query = 'SELECT * FROM fund_transactions WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找交易记录
  static async findByUserId(userId, limit = 50) {
    const query = `
      SELECT * FROM fund_transactions 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 根据基金ID查找交易记录
  static async findByFundId(fundId, limit = 50) {
    const query = `
      SELECT * FROM fund_transactions 
      WHERE fund_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [fundId, limit]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FundTransaction;