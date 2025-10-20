/**
 * 竞赛参与者模型
 */

const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'insert',
        data: {
          id: this.id,
          contest_id: this.contestId,
          user_id: this.userId,
          initial_balance: this.initialBalance,
          current_balance: this.currentBalance,
          rank: this.rank,
          created_at: this.createdAt,
          updated_at: this.updatedAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找竞赛参与者
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
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

  // 根据竞赛ID和用户ID查找参与者
  static async findByContestAndUser(contestId, userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'select',
        params: {
          filter: `contest_id = '${contestId}' AND user_id = '${userId}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取竞赛的所有参与者
  static async getByContest(contestId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'select',
        params: {
          filter: `contest_id = '${contestId}'`,
          sort: [
            { field: 'rank', order: 'asc' },
            { field: 'current_balance', order: 'desc' }
          ],
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
          const participant = record.fields;
          participant.username = userMap[participant.user_id] ? userMap[participant.user_id].username : 'Unknown';
          return participant;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的竞赛参与记录
  static async getByUser(userId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取竞赛信息
      if (result.records && result.records.length > 0) {
        const contestIds = [...new Set(result.records.map(record => record.fields.contest_id))];
        const contestResults = await dbAdapter.executeQuery({
          table: 'trading_contests',
          operation: 'select',
          params: {
            filter: `id IN (${contestIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        const contestMap = {};
        if (contestResults.records) {
          contestResults.records.forEach(record => {
            contestMap[record.fields.id] = record.fields;
          });
        }
        
        return result.records.map(record => {
          const participant = record.fields;
          const contest = contestMap[participant.contest_id];
          participant.contest_name = contest ? contest.name : 'Unknown Contest';
          participant.contest_status = contest ? contest.status : 'unknown';
          return participant;
        });
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 更新参与者信息
  static async update(id, updates) {
    const allowedFields = ['initial_balance', 'current_balance', 'rank', 'updated_at'];
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
        table: 'contest_participants',
        operation: 'update',
        recordId: id,
        data: updateData
      });
      
      return result !== null;
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
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