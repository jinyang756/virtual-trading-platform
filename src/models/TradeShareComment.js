/**
 * 交易分享评论模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class TradeShareComment {
  constructor(shareId, userId, content) {
    this.id = generateId();
    this.shareId = shareId;
    this.userId = userId;
    this.content = content;
    this.createdAt = new Date();
  }

  // 保存评论到数据库
  async save() {
    const query = `
      INSERT INTO trade_share_comments (id, share_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.shareId,
      this.userId,
      this.content,
      this.createdAt
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找评论
  static async findById(id) {
    const query = 'SELECT * FROM trade_share_comments WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的评论列表
  static async getComments(shareId, limit = 50, offset = 0) {
    const query = `
      SELECT tsc.*, u.username
      FROM trade_share_comments tsc
      JOIN users u ON tsc.user_id = u.id
      WHERE tsc.share_id = ?
      ORDER BY tsc.created_at ASC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [shareId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的评论列表
  static async getUserComments(userId, limit = 50, offset = 0) {
    const query = `
      SELECT tsc.*, ts.content as share_content
      FROM trade_share_comments tsc
      JOIN trade_shares ts ON tsc.share_id = ts.id
      WHERE tsc.user_id = ?
      ORDER BY tsc.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 更新评论内容
  static async update(id, content) {
    const query = 'UPDATE trade_share_comments SET content = ?, updated_at = ? WHERE id = ?';
    const values = [content, new Date(), id];
    
    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 删除评论
  static async delete(id) {
    const query = 'DELETE FROM trade_share_comments WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取评论数量
  static async getCommentsCount(shareId) {
    const query = 'SELECT COUNT(*) as count FROM trade_share_comments WHERE share_id = ?';
    
    try {
      const results = await executeQuery(query, [shareId]);
      return results[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TradeShareComment;