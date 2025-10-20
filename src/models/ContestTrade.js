/**
 * 竞赛交易记录模型
 */

const { executeQuery } = require('../database/connection');
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
    const query = `
      INSERT INTO contest_trades (id, contest_id, participant_id, trade_type, asset, quantity, price, profit_loss, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.contestId,
      this.participantId,
      this.tradeType,
      this.asset,
      this.quantity,
      this.price,
      this.profitLoss,
      this.timestamp
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找竞赛交易记录
  static async findById(id) {
    const query = 'SELECT * FROM contest_trades WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取竞赛的所有交易记录
  static async getByContest(contestId, limit = 100, offset = 0) {
    const query = `
      SELECT ct.*, u.username
      FROM contest_trades ct
      JOIN contest_participants cp ON ct.participant_id = cp.id
      JOIN users u ON cp.user_id = u.id
      WHERE ct.contest_id = ?
      ORDER BY ct.timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [contestId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取参与者的交易记录
  static async getByParticipant(participantId, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM contest_trades
      WHERE participant_id = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [participantId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户的交易记录（通过竞赛）
  static async getByUserInContest(contestId, userId, limit = 50, offset = 0) {
    const query = `
      SELECT ct.*, cp.id as participant_id
      FROM contest_trades ct
      JOIN contest_participants cp ON ct.participant_id = cp.id
      WHERE ct.contest_id = ? AND cp.user_id = ?
      ORDER BY ct.timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const results = await executeQuery(query, [contestId, userId, limit, offset]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 删除交易记录
  static async delete(id) {
    const query = 'DELETE FROM contest_trades WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 计算参与者的总盈亏
  static async calculateTotalProfitLoss(participantId) {
    const query = `
      SELECT SUM(profit_loss) as total_profit_loss
      FROM contest_trades
      WHERE participant_id = ?
    `;
    
    try {
      const results = await executeQuery(query, [participantId]);
      return results[0].total_profit_loss || 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContestTrade;