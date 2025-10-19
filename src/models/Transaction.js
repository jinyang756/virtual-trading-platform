const { executeQuery } = require('../database/connection');
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
    const query = `
      INSERT INTO transactions (id, user_id, asset, type, quantity, price, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.asset,
      this.type,
      this.quantity,
      this.price,
      this.timestamp
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存交易记录失败: ${error.message}`);
    }
  }

  // 根据ID查找交易记录
  static async findById(id) {
    const query = 'SELECT * FROM transactions WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找交易记录
  static async findByUserId(userId) {
    const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC';
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 更新交易状态
  static async updateStatus(id, status) {
    const query = 'UPDATE transactions SET status = ?, updated_at = NOW() WHERE id = ?';
    const values = [status, id];

    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新交易状态失败: ${error.message}`);
    }
  }
}

module.exports = Transaction;