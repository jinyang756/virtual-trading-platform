const dbAdapter = require('../database/dbAdapter');
const { generateId } = require('../utils/codeGenerator');

class Transaction {
  constructor(id, userId, asset, type, quantity, price, status = 'pending') {
    this.id = id || generateId();
    this.userId = userId;
    this.asset = asset;
    this.type = type; // 'buy' or 'sell'
    this.quantity = quantity;
    this.price = price;
    this.status = status; // 'pending', 'completed', 'cancelled'
    this.timestamp = new Date();
  }

  // 保存交易记录到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          asset: this.asset,
          type: this.type,
          quantity: this.quantity,
          price: this.price,
          status: this.status,
          timestamp: this.timestamp
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存交易记录失败: ${error.message}`);
    }
  }

  // 根据ID查找交易记录
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
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
  static async findByUserId(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
          sort: [{ field: 'timestamp', order: 'desc' }]
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 更新交易状态
  static async updateStatus(id, status) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'update',
        recordId: id,
        data: {
          status: status,
          updated_at: new Date()
        }
      });
      
      return result !== null;
    } catch (error) {
      throw new Error(`更新交易状态失败: ${error.message}`);
    }
  }
}

module.exports = Transaction;