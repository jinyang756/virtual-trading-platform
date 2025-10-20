/**
 * 竞赛交易记录模型
 */

const dbAdapter = require('../database/dbAdapter');
const { generateId } = require('../utils/codeGenerator');

class ContestTrade {
  constructor(contestId, participantId, tradeType, asset, quantity, price, profitLoss = 0) {
    this.id = generateId();
    this.contestId = contestId;
    this.participantId = participantId;
    this.tradeType = tradeType; // BUY, SELL
    this.asset = asset;
    this.quantity = quantity;
    this.price = price;
    this.profitLoss = profitLoss;
    this.timestamp = new Date();
  }

  // 保存竞赛交易记录到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
        operation: 'insert',
        data: {
          id: this.id,
          contest_id: this.contestId,
          participant_id: this.participantId,
          trade_type: this.tradeType,
          asset: this.asset,
          quantity: this.quantity,
          price: this.price,
          profit_loss: this.profitLoss,
          timestamp: this.timestamp
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找竞赛交易记录
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
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

  // 获取竞赛的所有交易记录
  static async getByContest(contestId, limit = 100, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
        operation: 'select',
        params: {
          filter: `contest_id = '${contestId}'`,
          sort: [{ field: 'timestamp', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      // 获取用户信息
      if (result.records && result.records.length > 0) {
        // 先获取参与者信息
        const participantIds = [...new Set(result.records.map(record => record.fields.participant_id))];
        const participantResults = await dbAdapter.executeQuery({
          table: 'contest_participants',
          operation: 'select',
          params: {
            filter: `id IN (${participantIds.map(id => `'${id}'`).join(',')})`
          }
        });
        
        if (participantResults.records) {
          const userIds = [...new Set(participantResults.records.map(record => record.fields.user_id))];
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
          
          const participantMap = {};
          participantResults.records.forEach(record => {
            const participant = record.fields;
            participant.username = userMap[participant.user_id] ? userMap[participant.user_id].username : 'Unknown';
            participantMap[participant.id] = participant;
          });
          
          return result.records.map(record => {
            const trade = record.fields;
            const participant = participantMap[trade.participant_id];
            trade.username = participant ? participant.username : 'Unknown';
            return trade;
          });
        }
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取参与者的交易记录
  static async getByParticipant(participantId, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
        operation: 'select',
        params: {
          filter: `participant_id = '${participantId}'`,
          sort: [{ field: 'timestamp', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的交易记录（通过竞赛）
  static async getByUserInContest(contestId, userId, limit = 50, offset = 0) {
    try {
      // 先获取参与者ID
      const participantResult = await dbAdapter.executeQuery({
        table: 'contest_participants',
        operation: 'select',
        params: {
          filter: `contest_id = '${contestId}' AND user_id = '${userId}'`
        }
      });
      
      if (participantResult.records && participantResult.records.length > 0) {
        const participantId = participantResult.records[0].fields.id;
        
        const result = await dbAdapter.executeQuery({
          table: 'contest_trades',
          operation: 'select',
          params: {
            filter: `participant_id = '${participantId}'`,
            sort: [{ field: 'timestamp', order: 'desc' }],
            take: limit,
            skip: offset
          }
        });
        
        return result.records ? result.records.map(record => record.fields) : [];
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 删除交易记录
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 计算参与者的总盈亏
  static async calculateTotalProfitLoss(participantId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contest_trades',
        operation: 'select',
        params: {
          filter: `participant_id = '${participantId}'`
        }
      });
      
      if (result.records) {
        return result.records.reduce((total, record) => total + (record.fields.profit_loss || 0), 0);
      }
      
      return 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContestTrade;