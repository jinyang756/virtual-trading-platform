/**
 * 交易分享模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class TradeShare {
  constructor(userId, tradeId, content = '') {
    this.id = generateId();
    this.userId = userId;
    this.tradeId = tradeId;
    this.content = content;
    this.likesCount = 0;
    this.commentsCount = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存交易分享到数据库
  async save() {
    const query = `
      INSERT INTO trade_shares (id, user_id, trade_id, content, likes_count, comments_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.userId,
      this.tradeId,
      this.content,
      this.likesCount,
      this.commentsCount,
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

  // 根据ID查找交易分享
  static async findById(id) {
    const query = 'SELECT * FROM trade_shares WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的交易分享列表
  static async getByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT ts.*, u.username
      FROM trade_shares ts
      JOIN users u ON ts.user_id = u.id
      WHERE ts.user_id = ?
      ORDER BY ts.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户关注的人的交易分享列表（时间线）
  static async getTimeline(userId, limit = 50, offset = 0) {
    const query = `
      SELECT ts.*, u.username
      FROM trade_shares ts
      JOIN users u ON ts.user_id = u.id
      JOIN user_follows uf ON ts.user_id = uf.followed_id
      WHERE uf.follower_id = ?
      ORDER BY ts.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 更新交易分享内容
  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (['content', 'likes_count', 'comments_count', 'updated_at'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    values.push(id);
    const query = `UPDATE trade_shares SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除交易分享
  static async delete(id) {
    const query = 'DELETE FROM trade_shares WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的点赞数
  static async getLikesCount(shareId) {
    const query = 'SELECT likes_count FROM trade_shares WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [shareId]);
      return results.length > 0 ? results[0].likes_count : 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的评论数
  static async getCommentsCount(shareId) {
    const query = 'SELECT comments_count FROM trade_shares WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [shareId]);
      return results.length > 0 ? results[0].comments_count : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TradeShare;