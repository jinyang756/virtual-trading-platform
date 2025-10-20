/**
 * 交易竞赛模型
 */

const dbAdapter = require('../database/dbAdapter');
const { generateId } = require('../utils/codeGenerator');

class TradingContest {
  constructor(name, description, startTime, endTime, prizePool = 0) {
    this.id = generateId();
    this.name = name;
    this.description = description;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.prizePool = prizePool;
    this.status = 'upcoming'; // upcoming, active, ended
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存交易竞赛到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trading_contests',
        operation: 'insert',
        data: {
          id: this.id,
          name: this.name,
          description: this.description,
          start_time: this.startTime,
          end_time: this.endTime,
          prize_pool: this.prizePool,
          status: this.status,
          created_at: this.createdAt,
          updated_at: this.updatedAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找交易竞赛
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trading_contests',
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

  // 获取所有交易竞赛
  static async getAll(limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trading_contests',
        operation: 'select',
        params: {
          sort: [{ field: 'start_time', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 根据状态获取交易竞赛
  static async getByStatus(status, limit = 50, offset = 0) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trading_contests',
        operation: 'select',
        params: {
          filter: `status = '${status}'`,
          sort: [{ field: 'start_time', order: 'desc' }],
          take: limit,
          skip: offset
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 更新交易竞赛
  static async update(id, updates) {
    const allowedFields = ['name', 'description', 'start_time', 'end_time', 'prize_pool', 'status', 'updated_at'];
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
        table: 'trading_contests',
        operation: 'update',
        recordId: id,
        data: updateData
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 删除交易竞赛
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'trading_contests',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  // 检查竞赛是否进行中
  static isActive(contest) {
    const now = new Date();
    return contest.status === 'active' && 
           new Date(contest.start_time) <= now && 
           new Date(contest.end_time) >= now;
  }

  // 检查竞赛是否已结束
  static isEnded(contest) {
    const now = new Date();
    return contest.status === 'ended' || new Date(contest.end_time) < now;
  }

  // 启动竞赛
  static async startContest(id) {
    const now = new Date();
    return await this.update(id, {
      status: 'active',
      updated_at: now
    });
  }

  // 结束竞赛
  static async endContest(id) {
    const now = new Date();
    return await this.update(id, {
      status: 'ended',
      updated_at: now
    });
  }
}

module.exports = TradingContest;