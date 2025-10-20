/**
 * 交易分享评论模型
 */

const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
        operation: 'insert',
        data: {
          id: this.id,
          share_id: this.shareId,
          user_id: this.userId,
          content: this.content,
          created_at: this.createdAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找评论
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
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

  // 获取交易分享的评论列表
  static async getComments(shareId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
        operation: 'select',
        params: {
          filter: `share_id = '${shareId}'`,
          sort: [{ field: 'created_at', order: 'asc' }],
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
          const comment = record.fields;
          comment.username = userMap[comment.user_id] ? userMap[comment.user_id].username : 'Unknown';
          return comment;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的评论列表
  static async getUserComments(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
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
          const comment = record.fields;
          comment.share_content = shareMap[comment.share_id] ? shareMap[comment.share_id].content : '';
          return comment;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 更新评论内容
  static async update(id, content) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
        operation: 'update',
        recordId: id,
        data: {
          content: content,
          updated_at: new Date()
        }
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 删除评论
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 获取评论数量
  static async getCommentsCount(shareId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trade_share_comments',
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

module.exports = TradeShareComment;