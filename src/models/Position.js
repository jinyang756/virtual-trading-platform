const { executeQuery } = require('../database/connection');
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
    const query = `
      INSERT INTO positions (id, user_id, asset, quantity, avg_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.asset,
      this.quantity,
      this.avgPrice
    ];

    try {
      const result = await executeQuery(query, values);
      return this;
    } catch (error) {
      throw new Error(`保存持仓失败: ${error.message}`);
    }
  }

  // 根据用户ID查找持仓
  static async findByUserId(userId) {
    const query = 'SELECT * FROM positions WHERE user_id = ?';
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 根据ID查找持仓
  static async findById(id) {
    const query = 'SELECT * FROM positions WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 更新持仓
  static async update(id, updates) {
    const query = `
      UPDATE positions 
      SET quantity = ?, avg_price = ?
      WHERE id = ?
    `;
    const values = [updates.quantity, updates.avgPrice, id];

    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`更新持仓失败: ${error.message}`);
    }
  }

  // 删除持仓
  static async delete(id) {
    const query = 'DELETE FROM positions WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`删除持仓失败: ${error.message}`);
    }
  }
}

module.exports = Position;