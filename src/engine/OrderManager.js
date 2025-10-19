const Transaction = require('../models/Transaction');
const Position = require('../models/Position');
const { generateId } = require('../utils/codeGenerator');

class OrderManager {
  constructor() {
    this.orders = [];
    this.positions = [];
  }

  // 执行订单
  async executeOrder(order) {
    try {
      // 创建交易记录
      const transactionId = generateId();
      const transaction = new Transaction(
        transactionId,
        order.userId,
        order.asset,
        order.type,
        order.quantity,
        order.price,
        'completed'
      );
      
      await transaction.save();
      this.orders.push(transaction);
      
      // 更新持仓
      await this.updatePosition(order);
      
      return {
        success: true,
        transactionId: transactionId,
        price: order.price,
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`执行订单失败: ${error.message}`);
    }
  }

  // 更新持仓
  async updatePosition(order) {
    try {
      // 查找现有持仓
      const existingPositions = await Position.findByUserId(order.userId);
      const existingPosition = existingPositions.find(p => p.asset === order.asset);
      
      if (existingPosition) {
        // 更新现有持仓
        let newQuantity, newAvgPrice;
        
        if (order.type === 'buy') {
          // 买入：增加持仓数量，重新计算平均价格
          newQuantity = existingPosition.quantity + order.quantity;
          newAvgPrice = (existingPosition.quantity * existingPosition.avgPrice + order.quantity * order.price) / newQuantity;
        } else {
          // 卖出：减少持仓数量
          newQuantity = existingPosition.quantity - order.quantity;
          newAvgPrice = existingPosition.avgPrice;
          
          // 如果持仓数量为0或负数，删除持仓
          if (newQuantity <= 0) {
            await Position.delete(existingPosition.id);
            return;
          }
        }
        
        await Position.update(existingPosition.id, {
          quantity: newQuantity,
          avgPrice: newAvgPrice,
          updatedAt: new Date()
        });
      } else {
        // 创建新持仓
        if (order.type === 'buy') {
          const positionId = generateId();
          const newPosition = new Position(
            positionId,
            order.userId,
            order.asset,
            order.quantity,
            order.price
          );
          await newPosition.save();
          this.positions.push(newPosition);
        }
        // 如果是卖出且没有持仓，则不处理
      }
    } catch (error) {
      throw new Error(`更新持仓失败: ${error.message}`);
    }
  }

  // 获取用户持仓
  async getUserPositions(userId) {
    return await Position.findByUserId(userId);
  }

  // 获取订单历史
  async getOrderHistory(userId) {
    return await Transaction.findByUserId(userId);
  }

  // 取消订单
  async cancelOrder(orderId) {
    try {
      const transaction = await Transaction.updateStatus(orderId, 'cancelled');
      return transaction;
    } catch (error) {
      throw new Error(`取消订单失败: ${error.message}`);
    }
  }
}

module.exports = OrderManager;