const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          strategy_id: this.strategyId,
          direction: this.direction,
          investment: this.investment,
          status: this.status,
          order_time: this.orderTime,
          expire_time: this.expireTime
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存二元期权订单失败: ${error.message}`);
    }
  }

  // 更新订单状态
  async updateStatus(status, settlePrice = null, payout = null, profitLoss = null, settleTime = null) {
    try {
      const updateData = {
        status: status
      };
      
      if (settlePrice !== null && payout !== null && profitLoss !== null && settleTime !== null) {
        updateData.settle_price = settlePrice;
        updateData.payout = payout;
        updateData.profit_loss = profitLoss;
        updateData.settle_time = settleTime;
      }
      
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'update',
        recordId: this.id,
        data: updateData
      });
      
      this.status = status;
      if (settlePrice !== null) {
        this.settlePrice = settlePrice;
        this.payout = payout;
        this.profitLoss = profitLoss;
        this.settleTime = settleTime;
      }
      return result !== null;
    } catch (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }
  }

  // 根据ID查找订单
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
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

  // 根据用户ID查找活跃订单
  static async findActiveByUserId(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND status = 'ACTIVE'`,
          sort: [{ field: 'order_time', order: 'desc' }]
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找订单历史
  static async findHistoryByUserId(userId, limit = 50) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND status != 'ACTIVE'`,
          sort: [{ field: 'order_time', order: 'desc' }],
          take: limit
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 查找过期订单
  static async findExpiredOrders() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'select',
        params: {
          filter: `status = 'ACTIVE' AND expire_time <= '${new Date().toISOString()}'`
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BinaryOrder;