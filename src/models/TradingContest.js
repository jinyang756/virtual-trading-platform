/**
 * 交易竞赛模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class TradingContest {
  constructor(name, description, startTime, endTime, prizePool = 0) {
    this.id = generateId();
    this.name = name;
    this.description = description;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.prizePool = prizePool;
    this.status = 'upcoming'; // upcoming, active, ended
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存交易竞赛到数据库
  async save() {
    const query = `
      INSERT INTO trading_contests (id, name, description, start_time, end_time, prize_pool, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.name,
      this.description,
      this.startTime,
      this.endTime,
      this.prizePool,
      this.status,
      this.createdAt,
      this.updatedAt
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找交易竞赛
  static async findById(id) {
    const query = 'SELECT * FROM trading_contests WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取所有交易竞赛
  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT * FROM trading_contests
      ORDER BY start_time DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 根据状态获取交易竞赛
  static async getByStatus(status, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM trading_contests
      WHERE status = ?
      ORDER BY start_time DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [status, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 更新交易竞赛
  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (['name', 'description', 'start_time', 'end_time', 'prize_pool', 'status', 'updated_at'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    values.push(id);
    const query = `UPDATE trading_contests SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除交易竞赛
  static async delete(id) {
    const query = 'DELETE FROM trading_contests WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 检查竞赛是否进行中
  static isActive(contest) {
    const now = new Date();
    return contest.status === 'active' && 
           new Date(contest.start_time) <= now && 
           new Date(contest.end_time) >= now;
  }

  // 检查竞赛是否已结束
  static isEnded(contest) {
    const now = new Date();
    return contest.status === 'ended' || new Date(contest.end_time) < now;
  }

  // 启动竞赛
  static async startContest(id) {
    const now = new Date();
    return await this.update(id, {
      status: 'active',
      updated_at: now
    });
  }

  // 结束竞赛
  static async endContest(id) {
    const now = new Date();
    return await this.update(id, {
      status: 'ended',
      updated_at: now
    });
  }
}

module.exports = TradingContest;