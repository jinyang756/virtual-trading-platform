const dbAdapter = require('../database/dbAdapter');
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

  // 保存持仓到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'positions',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          asset: this.asset,
          quantity: this.quantity,
          avg_price: this.avgPrice,
          leverage: this.leverage
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存持仓失败: ${error.message}`);
    }
  }

  // 根据用户ID查找持仓
  static async findByUserId(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'positions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 根据ID查找持仓
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'positions',
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

  // 更新持仓
  static async update(id, updates) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'positions',
        operation: 'update',
        recordId: id,
        data: {
          quantity: updates.quantity,
          avg_price: updates.avgPrice
        }
      });
      
      return result !== null;
    } catch (error) {
      throw new Error(`更新持仓失败: ${error.message}`);
    }
  }

  // 删除持仓
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'positions',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw new Error(`删除持仓失败: ${error.message}`);
    }
  }
}

module.exports = Position;