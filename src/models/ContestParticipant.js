/**
 * 竞赛参与者模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class ContestParticipant {
  constructor(contestId, userId, initialBalance) {
    this.id = generateId();
    this.contestId = contestId;
    this.userId = userId;
    this.initialBalance = initialBalance;
    this.currentBalance = initialBalance;
    this.rank = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存竞赛参与者到数据库
  async save() {
    const query = `
      INSERT INTO contest_participants (id, contest_id, user_id, initial_balance, current_balance, rank, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.contestId,
      this.userId,
      this.initialBalance,
      this.currentBalance,
      this.rank,
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

  // 根据ID查找竞赛参与者
  static async findById(id) {
    const query = 'SELECT * FROM contest_participants WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据竞赛ID和用户ID查找参与者
  static async findByContestAndUser(contestId, userId) {
    const query = 'SELECT * FROM contest_participants WHERE contest_id = ? AND user_id = ?';
    
    try {
      const results = await executeQuery(query, [contestId, userId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取竞赛的所有参与者
  static async getByContest(contestId, limit = 50, offset = 0) {
    const query = `
      SELECT cp.*, u.username
      FROM contest_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.contest_id = ?
      ORDER BY cp.rank ASC, cp.current_balance DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [contestId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的竞赛参与记录
  static async getByUser(userId, limit = 50, offset = 0) {
    const query = `
      SELECT cp.*, tc.name as contest_name, tc.status as contest_status
      FROM contest_participants cp
      JOIN trading_contests tc ON cp.contest_id = tc.id
      WHERE cp.user_id = ?
      ORDER BY cp.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 更新参与者信息
  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (['initial_balance', 'current_balance', 'rank', 'updated_at'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    values.push(id);
    const query = `UPDATE contest_participants SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 更新参与者的余额和排名
  static async updateBalanceAndRank(participantId, currentBalance, rank) {
    return await this.update(participantId, {
      current_balance: currentBalance,
      rank: rank,
      updated_at: new Date()
    });
  }

  // 删除参与者
  static async delete(id) {
    const query = 'DELETE FROM contest_participants WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 计算收益率
  calculateReturnRate() {
    return ((this.currentBalance - this.initialBalance) / this.initialBalance) * 100;
  }
}

module.exports = ContestParticipant;