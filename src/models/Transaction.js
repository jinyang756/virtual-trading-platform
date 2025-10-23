const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
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

  // 保存交易记录到文件
  async save() {
    try {
      const ordersPath = path.join(config.dataPath, 'orders.json');
      let orders = [];
      
      // 读取现有订单
      try {
        const data = await fs.readFile(ordersPath, 'utf8');
        orders = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        orders = [];
      }
      
      // 添加新订单
      orders.push({
        id: this.id,
        userId: this.userId,
        asset: this.asset,
        type: this.type,
        quantity: this.quantity,
        price: this.price,
        status: this.status,
        timestamp: this.timestamp
      });
      
      // 写入文件
      await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2));
      
      return this;
    } catch (error) {
      throw new Error(`保存交易记录失败: ${error.message}`);
    }
  }

  // 根据ID查找交易记录
  static async findById(id) {
    try {
      const ordersPath = path.join(config.dataPath, 'orders.json');
      let orders = [];
      
      // 读取订单数据
      try {
        const data = await fs.readFile(ordersPath, 'utf8');
        orders = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，返回null
        return null;
      }
      
      // 查找指定ID的订单
      return orders.find(order => order.id === id) || null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户ID查找交易记录
  static async findByUserId(userId) {
    try {
      const ordersPath = path.join(config.dataPath, 'orders.json');
      let orders = [];
      
      // 读取订单数据
      try {
        const data = await fs.readFile(ordersPath, 'utf8');
        orders = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，返回空数组
        return [];
      }
      
      // 筛选指定用户的订单
      return orders.filter(order => order.userId === userId);
    } catch (error) {
      throw error;
    }
  }

  // 更新交易状态
  static async updateStatus(id, status) {
    try {
      const ordersPath = path.join(config.dataPath, 'orders.json');
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
      const index = orders.findIndex(order => order.id === id);
      if (index !== -1) {
        orders[index].status = status;
        orders[index].updated_at = new Date();
        
        // 写入文件
        await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2));
        
        return true;
      }
      
      return false;
    } catch (error) {
      throw new Error(`更新交易状态失败: ${error.message}`);
    }
  }
}

module.exports = Transaction;