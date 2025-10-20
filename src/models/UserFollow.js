/**
 * 用户关注关系模型
 */

const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');

class UserFollow {
  constructor(followerId, followedId) {
    this.id = generateId();
    this.followerId = followerId;
    this.followedId = followedId;
    this.createdAt = new Date();
  }

  // 保存关注关系到数据库
  async save() {
    const query = `
      INSERT INTO user_follows (id, follower_id, followed_id, created_at)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.followerId,
      this.followedId,
      this.createdAt
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 取消关注
  static async unfollow(followerId, followedId) {
    const query = 'DELETE FROM user_follows WHERE follower_id = ? AND followed_id = ?';
    
    try {
      const result = await executeQuery(query, [followerId, followedId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 检查是否已关注
  static async isFollowing(followerId, followedId) {
    const query = 'SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ? AND followed_id = ?';
    
    try {
      const results = await executeQuery(query, [followerId, followedId]);
      return results[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的关注列表
  static async getFollowing(userId, limit = 50, offset = 0) {
    const query = `
      SELECT u.id, u.username, u.email, u.balance, u.created_at
      FROM user_follows uf
      JOIN users u ON uf.followed_id = u.id
      WHERE uf.follower_id = ?
      ORDER BY uf.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的粉丝列表
  static async getFollowers(userId, limit = 50, offset = 0) {
    const query = `
      SELECT u.id, u.username, u.email, u.balance, u.created_at
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.id
      WHERE uf.followed_id = ?
      ORDER BY uf.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的关注数量
  static async getFollowingCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?';
    
    try {
      const results = await executeQuery(query, [userId]);
      return results[0].count;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的粉丝数量
  static async getFollowersCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM user_follows WHERE followed_id = ?';
    
    try {
      const results = await executeQuery(query, [userId]);
      return results[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollow;