/**
 * 条件单交易模块
 * 实现条件触发的交易功能
 */

class ConditionalOrder {
  constructor() {
    // 存储所有设置的条件单
    this.conditionalOrders = new Map();
  }

  /**
   * 设置条件单
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} direction - 交易方向 (buy/sell)
   * @param {number} amount - 交易数量
   * @param {string} conditionType - 条件类型 (priceAbove/priceBelow)
   * @param {number} conditionPrice - 条件价格
   * @param {string} orderType - 订单类型 (market/limit)
   * @param {number} orderPrice - 订单价格（限价单使用）
   * @returns {string} 订单ID
   */
  setConditionalOrder(userId, symbol, direction, amount, conditionType, conditionPrice, orderType = 'market', orderPrice = null) {
    const orderId = this._generateOrderId();
    const order = {
      orderId,
      userId,
      symbol,
      direction,
      amount,
      conditionType,
      conditionPrice,
      orderType,
      orderPrice,
      status: 'pending', // pending, triggered, executed, cancelled
      createdAt: new Date()
    };
    
    this.conditionalOrders.set(orderId, order);
    return orderId;
  }

  /**
   * 检查是否触发条件单
   * @param {string} symbol - 交易品种
   * @param {number} currentPrice - 当前价格
   * @returns {Array} 触发的订单列表
   */
  checkTrigger(symbol, currentPrice) {
    const triggeredOrders = [];
    
    for (const [orderId, order] of this.conditionalOrders.entries()) {
      if (order.symbol === symbol && order.status === 'pending') {
        let shouldTrigger = false;
        
        // 价格高于条件价格时触发
        if (order.conditionType === 'priceAbove' && currentPrice >= order.conditionPrice) {
          shouldTrigger = true;
        }
        // 价格低于条件价格时触发
        else if (order.conditionType === 'priceBelow' && currentPrice <= order.conditionPrice) {
          shouldTrigger = true;
        }
        
        if (shouldTrigger) {
          order.status = 'triggered';
          triggeredOrders.push({ ...order });
        }
      }
    }
    
    return triggeredOrders;
  }

  /**
   * 执行条件单
   * @param {string} orderId - 订单ID
   * @returns {boolean} 是否执行成功
   */
  executeOrder(orderId) {
    const order = this.conditionalOrders.get(orderId);
    if (!order) {
      return false;
    }
    
    if (order.status === 'triggered') {
      order.status = 'executed';
      return true;
    }
    
    return false;
  }

  /**
   * 获取用户的所有条件单
   * @param {string} userId - 用户ID
   * @returns {Array} 订单列表
   */
  getUserOrders(userId) {
    const userOrders = [];
    
    for (const order of this.conditionalOrders.values()) {
      if (order.userId === userId) {
        userOrders.push({ ...order });
      }
    }
    
    return userOrders;
  }

  /**
   * 取消条件单
   * @param {string} orderId - 订单ID
   * @returns {boolean} 是否成功取消
   */
  cancelOrder(orderId) {
    const order = this.conditionalOrders.get(orderId);
    if (!order) {
      return false;
    }
    
    order.status = 'cancelled';
    return true;
  }

  /**
   * 获取条件单状态
   * @param {string} orderId - 订单ID
   * @returns {Object} 订单信息
   */
  getOrderStatus(orderId) {
    return this.conditionalOrders.get(orderId);
  }

  /**
   * 生成订单ID
   * @returns {string} 订单ID
   */
  _generateOrderId() {
    return 'cond_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = ConditionalOrder;