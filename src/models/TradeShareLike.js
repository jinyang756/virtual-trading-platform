/**
 * 交易分享点赞模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class TradeShareLike {
  constructor(shareId, userId) {
    this.id = generateId();
    this.shareId = shareId;
    this.userId = userId;
    this.createdAt = new Date();
  }

  // 保存点赞到数据库
  async save() {
    const query = `
      INSERT INTO trade_share_likes (id, share_id, user_id, created_at)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.shareId,
      this.userId,
      this.createdAt
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 取消点赞
  static async unlike(shareId, userId) {
    const query = 'DELETE FROM trade_share_likes WHERE share_id = ? AND user_id = ?';
    
    try {
      const result = await executeQuery(query, [shareId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 检查是否已点赞
  static async isLiked(shareId, userId) {
    const query = 'SELECT COUNT(*) as count FROM trade_share_likes WHERE share_id = ? AND user_id = ?';
    
    try {
      const results = await executeQuery(query, [shareId, userId]);
      return results[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的点赞列表
  static async getLikes(shareId, limit = 50, offset = 0) {
    const query = `
      SELECT tsl.*, u.username
      FROM trade_share_likes tsl
      JOIN users u ON tsl.user_id = u.id
      WHERE tsl.share_id = ?
      ORDER BY tsl.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [shareId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的点赞列表
  static async getUserLikes(userId, limit = 50, offset = 0) {
    const query = `
      SELECT tsl.*, ts.content
      FROM trade_share_likes tsl
      JOIN trade_shares ts ON tsl.share_id = ts.id
      WHERE tsl.user_id = ?
      ORDER BY tsl.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取点赞数量
  static async getLikesCount(shareId) {
    const query = 'SELECT COUNT(*) as count FROM trade_share_likes WHERE share_id = ?';
    
    try {
      const results = await executeQuery(query, [shareId]);
      return results[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TradeShareLike;