/**
 * 交易分享模型
 */

const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          trade_id: this.tradeId,
          content: this.content,
          likes_count: this.likesCount,
          comments_count: this.commentsCount,
          created_at: this.createdAt,
          updated_at: this.updatedAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找交易分享
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
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

  // 获取用户的交易分享列表
  static async getByUserId(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
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
          const share = record.fields;
          share.username = userMap[share.user_id] ? userMap[share.user_id].username : 'Unknown';
          return share;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户关注的人的交易分享列表（时间线）
  static async getTimeline(userId, limit = 50, offset = 0) {
    try {
      // 先获取用户关注的人
      const followResult = await dbAdapter.executeQuery({
        table: 'user_follows',
        operation: 'select',
        params: {
          filter: `follower_id = '${userId}'`
        }
      });
      
      if (followResult.records && followResult.records.length > 0) {
        const followedIds = followResult.records.map(record => record.fields.followed_id);
        
        // 获取关注用户的交易分享
        const shareResult = await dbAdapter.executeQuery({
          table: 'trade_shares',
          operation: 'select',
          params: {
            filter: `user_id IN (${followedIds.map(id => `'${id}'`).join(',')})`,
            sort: [{ field: 'created_at', order: 'desc' }],
            take: limit,
            skip: offset
          }
        });
        
        // 获取用户信息
        if (shareResult.records && shareResult.records.length > 0) {
          const userIds = [...new Set(shareResult.records.map(record => record.fields.user_id))];
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
          
          return shareResult.records.map(record => {
            const share = record.fields;
            share.username = userMap[share.user_id] ? userMap[share.user_id].username : 'Unknown';
            return share;
          });
        }
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 更新交易分享内容
  static async update(id, updates) {
    const allowedFields = ['content', 'likes_count', 'comments_count', 'updated_at'];
    const updateData = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // 转换字段名格式
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[dbField] = value;
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'update',
        recordId: id,
        data: updateData
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 删除交易分享
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的点赞数
  static async getLikesCount(shareId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'select',
        params: {
          filter: `id = '${shareId}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields.likes_count : 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取交易分享的评论数
  static async getCommentsCount(shareId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_shares',
        operation: 'select',
        params: {
          filter: `id = '${shareId}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields.comments_count : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TradeShare;