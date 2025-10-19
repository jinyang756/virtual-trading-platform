const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class ContractOrder {
  constructor(id, userId, symbolId, direction, amount, leverage) {
    this.id = id || generateId();
    this.userId = userId;
    this.symbolId = symbolId;
    this.direction = direction; // 'LONG' or 'SHORT'
    this.amount = amount;
    this.leverage = leverage;
    this.status = 'PENDING'; // 'PENDING', 'FILLED', 'CANCELLED'
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存订单到数据库
  async save() {
    const query = `
      INSERT INTO contract_orders 
      (id, user_id, symbol_id, direction, amount, leverage, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.symbolId,
      this.direction,
      this.amount,
      this.leverage,
      this.status,
      this.createdAt,
      this.updatedAt
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存合约订单失败: ${error.message}`);
    }
  }

  // 更新订单状态
  async updateStatus(status, entryPrice = null) {
    let query, values;
    
    if (entryPrice) {
      query = `
        UPDATE contract_orders 
        SET status = ?, entry_price = ?, updated_at = NOW()
        WHERE id = ?
      `;
      values = [status, entryPrice, this.id];
    } else {
      query = `
        UPDATE contract_orders 
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;
      values = [status, this.id];
    }

    try {
      const result = await executeQuery(query, values);
      this.status = status;
      if (entryPrice) {
        this.entryPrice = entryPrice;
      }
      this.updatedAt = new Date();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }
  }

  // 更新平仓信息
  async updateExitInfo(exitPrice, profitLoss) {
    const query = `
      UPDATE contract_orders 
      SET status = 'CLOSED', exit_price = ?, profit_loss = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const values = [exitPrice, profitLoss, this.id];

    try {
      const result = await executeQuery(query, values);
      this.status = 'CLOSED';
      this.exitPrice = exitPrice;
      this.profitLoss = profitLoss;
      this.updatedAt = new Date();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新平仓信息失败: ${error.message}`);
    }
  }

  // 根据ID查找订单
  static async findById(id) {
    const query = 'SELECT * FROM contract_orders WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找订单
  static async findByUserId(userId, limit = 50) {
    const query = `
      SELECT * FROM contract_orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 根据状态查找订单
  static async findByStatus(status) {
    const query = 'SELECT * FROM contract_orders WHERE status = ?';
    
    try {
      const results = await executeQuery(query, [status]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContractOrder;