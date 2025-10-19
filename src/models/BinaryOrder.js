const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class BinaryOrder {
  constructor(id, userId, strategyId, direction, investment) {
    this.id = id || generateId();
    this.userId = userId;
    this.strategyId = strategyId;
    this.direction = direction; // 'CALL' or 'PUT'
    this.investment = investment;
    this.status = 'ACTIVE'; // 'ACTIVE', 'SETTLED', 'EXPIRED'
    this.orderTime = new Date();
    this.expireTime = new Date(Date.now() + 60000); // 默认1分钟后到期
  }

  // 保存订单到数据库
  async save() {
    const query = `
      INSERT INTO binary_orders 
      (id, user_id, strategy_id, direction, investment, status, order_time, expire_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.strategyId,
      this.direction,
      this.investment,
      this.status,
      this.orderTime,
      this.expireTime
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存二元期权订单失败: ${error.message}`);
    }
  }

  // 更新订单状态
  async updateStatus(status, settlePrice = null, payout = null, profitLoss = null, settleTime = null) {
    let query, values;
    
    if (settlePrice !== null && payout !== null && profitLoss !== null && settleTime !== null) {
      query = `
        UPDATE binary_orders 
        SET status = ?, settle_price = ?, payout = ?, profit_loss = ?, settle_time = ?
        WHERE id = ?
      `;
      values = [status, settlePrice, payout, profitLoss, settleTime, this.id];
    } else {
      query = `
        UPDATE binary_orders 
        SET status = ?
        WHERE id = ?
      `;
      values = [status, this.id];
    }

    try {
      const result = await executeQuery(query, values);
      this.status = status;
      if (settlePrice !== null) {
        this.settlePrice = settlePrice;
        this.payout = payout;
        this.profitLoss = profitLoss;
        this.settleTime = settleTime;
      }
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }
  }

  // 根据ID查找订单
  static async findById(id) {
    const query = 'SELECT * FROM binary_orders WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找活跃订单
  static async findActiveByUserId(userId) {
    const query = `
      SELECT * FROM binary_orders 
      WHERE user_id = ? AND status = 'ACTIVE'
      ORDER BY order_time DESC
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找订单历史
  static async findHistoryByUserId(userId, limit = 50) {
    const query = `
      SELECT * FROM binary_orders 
      WHERE user_id = ? AND status != 'ACTIVE'
      ORDER BY order_time DESC 
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 查找过期订单
  static async findExpiredOrders() {
    const query = `
      SELECT * FROM binary_orders 
      WHERE status = 'ACTIVE' AND expire_time <= NOW()
    `;
    
    try {
      const results = await executeQuery(query);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BinaryOrder;