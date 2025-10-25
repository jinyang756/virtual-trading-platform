const Transaction = require('../models/Transaction');
const Position = require('../models/Position');
const { generateId } = require('../utils/codeGenerator');
const config = require('../../config');
const fs = require('fs').promises;
const path = require('path');

class TradeService {
  constructor() {
    this.dataPath = config.dataPath;
  }

  /**
   * 执行交易，确保数据一致性
   * @param {Object} tradeData - 交易数据
   * @param {string} userId - 用户ID
   * @returns {Object} 交易结果
   */
  async placeTrade(tradeData, userId) {
    // 模拟用户余额检查（在实际应用中应从用户模型获取）
    const userBalance = await this.getUserBalance(userId);
    
    try {
      // 1. 验证交易数据
      if (!userId || !tradeData.symbol || !tradeData.quantity || !tradeData.type) {
        throw new Error('缺少必要参数');
      }
      
      if (tradeData.quantity <= 0) {
        throw new Error('交易数量必须大于0');
      }
      
      // 2. 检查余额（仅针对买入交易）
      const tradeAmount = tradeData.quantity * (tradeData.price || 0);
      if (tradeData.type === 'buy' && userBalance < tradeAmount) {
        throw new Error('余额不足');
      }
      
      // 3. 创建交易记录
      const transactionId = generateId();
      const transaction = new Transaction(
        transactionId, 
        userId, 
        tradeData.symbol, 
        tradeData.type, 
        tradeData.quantity, 
        tradeData.price
      );
      await transaction.save();
      
      // 4. 更新用户持仓
      await this.updatePosition(userId, tradeData);
      
      // 5. 更新用户余额（在实际应用中应更新用户模型）
      await this.updateUserBalance(userId, tradeData, tradeAmount);
      
      // 6. 创建资金流水记录
      await this.createTransactionRecord(userId, transactionId, tradeAmount, tradeData);
      
      // 7. 更新交易状态为已完成
      await this.updateTransactionStatus(transactionId, 'completed');
      
      // 8. 发送实时通知
      const resultData = {
        id: transactionId,
        userId,
        symbol: tradeData.symbol,
        type: tradeData.type,
        quantity: tradeData.quantity,
        price: tradeData.price,
        amount: tradeAmount,
        status: 'completed',
        timestamp: new Date()
      };
      
      return {
        success: true,
        message: '交易成功',
        orderId: transactionId,
        data: resultData
      };
    } catch (error) {
      // 记录错误日志
      console.error('交易处理失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取用户余额（模拟实现）
   * @param {string} userId - 用户ID
   * @returns {number} 用户余额
   */
  async getUserBalance(userId) {
    // 在实际应用中，应从用户模型获取真实余额
    // 这里返回一个模拟值
    return 100000; // 模拟用户有100000的余额
  }
  
  /**
   * 更新用户持仓
   * @param {string} userId - 用户ID
   * @param {Object} tradeData - 交易数据
   */
  async updatePosition(userId, tradeData) {
    try {
      const positions = await Position.findByUserId(userId);
      let existingPosition = positions.find(pos => pos.name === tradeData.symbol);
      
      if (existingPosition) {
        // 更新现有持仓
        if (tradeData.type === 'buy') {
          // 买入：增加数量，重新计算平均价格
          const totalAmount = existingPosition.amount * existingPosition.cost + tradeData.quantity * (tradeData.price || 0);
          const totalQuantity = existingPosition.amount + tradeData.quantity;
          existingPosition.amount = totalQuantity;
          existingPosition.cost = totalAmount / totalQuantity;
        } else {
          // 卖出：减少数量
          existingPosition.amount -= tradeData.quantity;
          if (existingPosition.amount <= 0) {
            // 如果持仓数量为0或负数，删除持仓
            await Position.delete(existingPosition.id);
            return;
          }
        }
        await Position.update(existingPosition.id, existingPosition);
      } else {
        // 创建新持仓
        if (tradeData.type === 'buy') {
          const newPosition = new Position(
            generateId(),
            userId,
            tradeData.symbol,
            tradeData.quantity,
            tradeData.price || 0
          );
          await newPosition.save();
        }
        // 如果是卖出且没有持仓，则不处理
      }
    } catch (error) {
      throw new Error(`更新持仓失败: ${error.message}`);
    }
  }
  
  /**
   * 更新用户余额（模拟实现）
   * @param {string} userId - 用户ID
   * @param {Object} tradeData - 交易数据
   * @param {number} tradeAmount - 交易金额
   */
  async updateUserBalance(userId, tradeData, tradeAmount) {
    // 在实际应用中，应更新用户模型中的余额
    // 这里只是模拟实现
    console.log(`用户 ${userId} 余额更新: ${tradeData.type === 'buy' ? '减少' : '增加'} ${tradeAmount}`);
  }
  
  /**
   * 创建资金流水记录
   * @param {string} userId - 用户ID
   * @param {string} tradeId - 交易ID
   * @param {number} amount - 金额
   * @param {Object} tradeData - 交易数据
   */
  async createTransactionRecord(userId, tradeId, amount, tradeData) {
    try {
      const transactionsPath = path.join(this.dataPath, 'transactions.json');
      console.log('创建资金流水记录:', { userId, tradeId, amount, tradeData, transactionsPath });
      
      let transactions = [];
      
      // 读取现有资金流水记录
      try {
        const data = await fs.readFile(transactionsPath, 'utf8');
        transactions = JSON.parse(data);
        console.log('读取现有资金流水记录:', transactions.length);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        console.log('读取资金流水记录文件失败:', error.message);
        transactions = [];
      }
      
      // 添加新的资金流水记录
      const record = {
        id: generateId(),
        userId,
        tradeId,
        amount,
        type: tradeData.type === 'buy' ? 'outflow' : 'inflow',
        description: `${tradeData.type === 'buy' ? '买入' : '卖出'} ${tradeData.symbol}`,
        timestamp: new Date()
      };
      
      transactions.push(record);
      console.log('添加新的资金流水记录:', record);
      
      // 写入文件
      await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2));
      console.log('资金流水记录写入完成');
    } catch (error) {
      console.error('创建资金流水记录失败:', error);
      throw new Error(`创建资金流水记录失败: ${error.message}`);
    }
  }
  
  /**
   * 更新交易状态
   * @param {string} transactionId - 交易ID
   * @param {string} status - 状态
   */
  async updateTransactionStatus(transactionId, status) {
    try {
      const ordersPath = path.join(this.dataPath, 'orders.json');
      let orders = [];
      
      // 读取现有订单
      try {
        const data = await fs.readFile(ordersPath, 'utf8');
        orders = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        orders = [];
      }
      
      // 查找并更新指定订单状态
      const index = orders.findIndex(order => order.id === transactionId);
      if (index !== -1) {
        orders[index].status = status;
        orders[index].updated_at = new Date();
        
        // 写入文件
        await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2));
      }
    } catch (error) {
      throw new Error(`更新交易状态失败: ${error.message}`);
    }
  }
}

module.exports = new TradeService();