/**
 * 止损止盈功能模块
 * 实现交易的止损和止盈功能
 */

class StopLossTakeProfit {
  constructor() {
    // 存储所有设置的止损止盈订单
    this.stopLossOrders = new Map();
    this.takeProfitOrders = new Map();
  }

  /**
   * 设置止损订单
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} direction - 交易方向 (buy/sell)
   * @param {number} amount - 交易数量
   * @param {number} entryPrice - 入场价格
   * @param {number} stopLossPrice - 止损价格
   * @returns {string} 订单ID
   */
  setStopLoss(userId, symbol, direction, amount, entryPrice, stopLossPrice) {
    const orderId = this._generateOrderId();
    const order = {
      orderId,
      userId,
      symbol,
      direction,
      amount,
      entryPrice,
      stopLossPrice,
      createdAt: new Date()
    };
    
    this.stopLossOrders.set(orderId, order);
    return orderId;
  }

  /**
   * 设置止盈订单
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} direction - 交易方向 (buy/sell)
   * @param {number} amount - 交易数量
   * @param {number} entryPrice - 入场价格
   * @param {number} takeProfitPrice - 止盈价格
   * @returns {string} 订单ID
   */
  setTakeProfit(userId, symbol, direction, amount, entryPrice, takeProfitPrice) {
    const orderId = this._generateOrderId();
    const order = {
      orderId,
      userId,
      symbol,
      direction,
      amount,
      entryPrice,
      takeProfitPrice,
      createdAt: new Date()
    };
    
    this.takeProfitOrders.set(orderId, order);
    return orderId;
  }

  /**
   * 检查是否触发止损或止盈
   * @param {string} symbol - 交易品种
   * @param {number} currentPrice - 当前价格
   * @returns {Array} 触发的订单列表
   */
  checkTrigger(symbol, currentPrice) {
    const triggeredOrders = [];
    
    // 检查止损订单
    for (const [orderId, order] of this.stopLossOrders.entries()) {
      if (order.symbol === symbol) {
        // 对于买入订单，当前价格低于止损价格时触发
        if (order.direction === 'buy' && currentPrice <= order.stopLossPrice) {
          triggeredOrders.push({ ...order, type: 'stopLoss' });
          this.stopLossOrders.delete(orderId);
        }
        // 对于卖出订单，当前价格高于止损价格时触发
        else if (order.direction === 'sell' && currentPrice >= order.stopLossPrice) {
          triggeredOrders.push({ ...order, type: 'stopLoss' });
          this.stopLossOrders.delete(orderId);
        }
      }
    }
    
    // 检查止盈订单
    for (const [orderId, order] of this.takeProfitOrders.entries()) {
      if (order.symbol === symbol) {
        // 对于买入订单，当前价格高于止盈价格时触发
        if (order.direction === 'buy' && currentPrice >= order.takeProfitPrice) {
          triggeredOrders.push({ ...order, type: 'takeProfit' });
          this.takeProfitOrders.delete(orderId);
        }
        // 对于卖出订单，当前价格低于止盈价格时触发
        else if (order.direction === 'sell' && currentPrice <= order.takeProfitPrice) {
          triggeredOrders.push({ ...order, type: 'takeProfit' });
          this.takeProfitOrders.delete(orderId);
        }
      }
    }
    
    return triggeredOrders;
  }

  /**
   * 获取用户的所有止损止盈订单
   * @param {string} userId - 用户ID
   * @returns {Array} 订单列表
   */
  getUserOrders(userId) {
    const userOrders = [];
    
    // 获取用户的止损订单
    for (const order of this.stopLossOrders.values()) {
      if (order.userId === userId) {
        userOrders.push({ ...order, type: 'stopLoss' });
      }
    }
    
    // 获取用户的止盈订单
    for (const order of this.takeProfitOrders.values()) {
      if (order.userId === userId) {
        userOrders.push({ ...order, type: 'takeProfit' });
      }
    }
    
    return userOrders;
  }

  /**
   * 取消止损止盈订单
   * @param {string} orderId - 订单ID
   * @returns {boolean} 是否成功取消
   */
  cancelOrder(orderId) {
    if (this.stopLossOrders.has(orderId)) {
      this.stopLossOrders.delete(orderId);
      return true;
    }
    
    if (this.takeProfitOrders.has(orderId)) {
      this.takeProfitOrders.delete(orderId);
      return true;
    }
    
    return false;
  }

  /**
   * 生成订单ID
   * @returns {string} 订单ID
   */
  _generateOrderId() {
    return 'sltp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = StopLossTakeProfit;