/**
 * 交易分享点赞模型
 */

const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'insert',
        data: {
          id: this.id,
          share_id: this.shareId,
          user_id: this.userId,
          created_at: this.createdAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 取消点赞
  static async unlike(shareId, userId) {
    try {
      // 先查询记录ID
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'select',
        params: {
          filter: `share_id = '${shareId}' AND user_id = '${userId}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const recordId = result.records[0].id;
        const deleteResult = await dbAdapter.executeQuery({
          table: 'trade_share_likes',
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

  // 检查是否已点赞
  static async isLiked(shareId, userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'select',
        params: {
          filter: `share_id = '${shareId}' AND user_id = '${userId}'`
        }
      });
      
      return result.records && result.records.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的点赞列表
  static async getLikes(shareId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'select',
        params: {
          filter: `share_id = '${shareId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取用户信息
      if (result.records && result.records.length > 0) {
        const userIds = [...new Set(result.records.map(record => record.fields.user_id))];
        const userResults = await dbAdapter.executeQuery({
          table: 'users',
          operation: 'select',
          params: {
            filter: `id IN (${userIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        const userMap = {};
        if (userResults.records) {
          userResults.records.forEach(record => {
            userMap[record.fields.id] = record.fields;
          });
        }
        
        return result.records.map(record => {
          const like = record.fields;
          like.username = userMap[like.user_id] ? userMap[like.user_id].username : 'Unknown';
          return like;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的点赞列表
  static async getUserLikes(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取交易分享内容
      if (result.records && result.records.length > 0) {
        const shareIds = [...new Set(result.records.map(record => record.fields.share_id))];
        const shareResults = await dbAdapter.executeQuery({
          table: 'trade_shares',
          operation: 'select',
          params: {
            filter: `id IN (${shareIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        const shareMap = {};
        if (shareResults.records) {
          shareResults.records.forEach(record => {
            shareMap[record.fields.id] = record.fields;
          });
        }
        
        return result.records.map(record => {
          const like = record.fields;
          like.content = shareMap[like.share_id] ? shareMap[like.share_id].content : '';
          return like;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取点赞数量
  static async getLikesCount(shareId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_likes',
        operation: 'select',
        params: {
          filter: `share_id = '${shareId}'`
        }
      });
      
      return result.records ? result.records.length : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TradeShareLike;