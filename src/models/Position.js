const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const { generateId } = require('../utils/codeGenerator');

class Position {
  constructor(id, userId, asset, quantity, avgPrice, leverage = 1) {
    this.id = id || generateId();
    this.userId = userId;
    this.asset = asset;
    this.quantity = quantity;
    this.avgPrice = avgPrice;
    this.leverage = leverage;
  }

  // 保存持仓到文件
  async save() {
    try {
      const positionsPath = path.join(config.dataPath, 'positions.json');
      let positions = [];
      
      // 读取现有持仓
      try {
        const data = await fs.readFile(positionsPath, 'utf8');
        positions = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        positions = [];
      }
      
      // 添加新持仓
      positions.push({
        id: this.id,
        userId: this.userId,
        asset: this.asset,
        quantity: this.quantity,
        avgPrice: this.avgPrice,
        leverage: this.leverage
      });
      
      // 写入文件
      await fs.writeFile(positionsPath, JSON.stringify(positions, null, 2));
      
      return this;
    } catch (error) {
      throw new Error(`保存持仓失败: ${error.message}`);
    }
  }

  // 根据用户ID查找持仓
  static async findByUserId(userId) {
    try {
      const positionsPath = path.join(config.dataPath, 'positions.json');
      let positions = [];
      
      // 读取持仓数据
      try {
        const data = await fs.readFile(positionsPath, 'utf8');
        positions = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，返回空数组
        return [];
      }
      
      // 筛选指定用户的持仓
      const userPositions = positions.filter(pos => pos.userId === userId);
      
      // 转换数据格式以匹配前端期望
      return userPositions.map(pos => ({
        id: pos.id,
        name: pos.asset,
        amount: pos.quantity,
        cost: pos.avgPrice,
        price: pos.avgPrice * 1.05, // 模拟当前价格
        pnl: (pos.avgPrice * 1.05 - pos.avgPrice) * pos.quantity // 模拟盈亏
      }));
    } catch (error) {
      throw error;
    }
  }

  // 根据ID查找持仓
  static async findById(id) {
    try {
      const positionsPath = path.join(config.dataPath, 'positions.json');
      let positions = [];
      
      // 读取持仓数据
      try {
        const data = await fs.readFile(positionsPath, 'utf8');
        positions = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，返回null
        return null;
      }
      
      // 查找指定ID的持仓
      const position = positions.find(pos => pos.id === id);
      
      if (!position) {
        return null;
      }
      
      // 转换数据格式
      return {
        id: position.id,
        userId: position.userId,
        asset: position.asset,
        quantity: position.quantity,
        avgPrice: position.avgPrice,
        leverage: position.leverage
      };
    } catch (error) {
      throw error;
    }
  }

  // 更新持仓
  static async update(id, updates) {
    try {
      const positionsPath = path.join(config.dataPath, 'positions.json');
      let positions = [];
      
      // 读取现有持仓
      try {
        const data = await fs.readFile(positionsPath, 'utf8');
        positions = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        positions = [];
      }
      
      // 查找并更新指定持仓
      const index = positions.findIndex(pos => pos.id === id);
      if (index !== -1) {
        positions[index] = { ...positions[index], ...updates };
        
        // 写入文件
        await fs.writeFile(positionsPath, JSON.stringify(positions, null, 2));
        
        return true;
      }
      
      return false;
    } catch (error) {
      throw new Error(`更新持仓失败: ${error.message}`);
    }
  }

  // 删除持仓
  static async delete(id) {
    try {
      const positionsPath = path.join(config.dataPath, 'positions.json');
      let positions = [];
      
      // 读取现有持仓
      try {
        const data = await fs.readFile(positionsPath, 'utf8');
        positions = JSON.parse(data);
      } catch (error) {
        // 如果文件不存在或解析失败，使用空数组
        positions = [];
      }
      
      // 过滤掉要删除的持仓
      const filteredPositions = positions.filter(pos => pos.id !== id);
      
      // 如果没有变化，说明持仓不存在
      if (filteredPositions.length === positions.length) {
        return false;
      }
      
      // 写入文件
      await fs.writeFile(positionsPath, JSON.stringify(filteredPositions, null, 2));
      
      return true;
    } catch (error) {
      throw new Error(`删除持仓失败: ${error.message}`);
    }
  }
}

module.exports = Position;