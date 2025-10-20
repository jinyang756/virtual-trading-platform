/**
 * 用户关注关系模型
 */

const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'insert',
        data: {
          id: this.id,
          follower_id: this.followerId,
          followed_id: this.followedId,
          created_at: this.createdAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 取消关注
  static async unfollow(followerId, followedId) {
    try {
      // 先查询记录ID
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `follower_id = '${followerId}' AND followed_id = '${followedId}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const recordId = result.records[0].id;
        const deleteResult = await dbAdapter.executeQuery({
          table: 'user_follows',
          operation: 'delete',
          recordId: recordId
        });
        return deleteResult !== null;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  // 检查是否已关注
  static async isFollowing(followerId, followedId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `follower_id = '${followerId}' AND followed_id = '${followedId}'`
        }
      });
      
      return result.records && result.records.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的关注列表
  static async getFollowing(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `follower_id = '${userId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取关注用户的详细信息
      if (result.records && result.records.length > 0) {
        const followedIds = result.records.map(record => record.fields.followed_id);
        const userResults = await dbAdapter.executeQuery({
          table: 'users',
          operation: 'select',
          params: {
            filter: `id IN (${followedIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        return userResults.records ? userResults.records.map(record => record.fields) : [];
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的粉丝列表
  static async getFollowers(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `followed_id = '${userId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取粉丝用户的详细信息
      if (result.records && result.records.length > 0) {
        const followerIds = result.records.map(record => record.fields.follower_id);
        const userResults = await dbAdapter.executeQuery({
          table: 'users',
          operation: 'select',
          params: {
            filter: `id IN (${followerIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        return userResults.records ? userResults.records.map(record => record.fields) : [];
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的关注数量
  static async getFollowingCount(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `follower_id = '${userId}'`
        }
      });
      
      return result.records ? result.records.length : 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的粉丝数量
  static async getFollowersCount(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `followed_id = '${userId}'`
        }
      });
      
      return result.records ? result.records.length : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollow;