const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_transactions',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          fund_id: this.fundId,
          type: this.type,
          amount: this.amount,
          shares: this.shares,
          nav: this.nav,
          fee: this.fee,
          timestamp: this.timestamp
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存基金交易记录失败: ${error.message}`);
    }
  }

  // 根据ID查找交易记录
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_transactions',
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

  // 根据用户ID查找交易记录
  static async findByUserId(userId, limit = 50) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
          sort: [{ field: 'timestamp', order: 'desc' }],
          take: limit
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 根据基金ID查找交易记录
  static async findByFundId(fundId, limit = 50) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'fund_transactions',
        operation: 'select',
        params: {
          filter: `fund_id = '${fundId}'`,
          sort: [{ field: 'timestamp', order: 'desc' }],
          take: limit
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FundTransaction;