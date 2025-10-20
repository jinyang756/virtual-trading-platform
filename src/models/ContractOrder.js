const dbAdapter = require('../database/dbAdapter');
const { generateId } = require('../utils/codeGenerator');

class ContractOrder {
  constructor(id, userId, symbolId, direction, amount, leverage) {
    this.id = id || generateId();
    this.userId = userId;
    this.symbolId = symbolId;
    this.direction = direction; // 'LONG' or 'SHORT'
    this.amount = amount;
    this.leverage = leverage;
    this.status = 'PENDING'; // 'PENDING', 'FILLED', 'CANCELLED'
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 保存订单到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
        operation: 'insert',
        data: {
          id: this.id,
          user_id: this.userId,
          symbol_id: this.symbolId,
          direction: this.direction,
          amount: this.amount,
          leverage: this.leverage,
          status: this.status,
          created_at: this.createdAt,
          updated_at: this.updatedAt
        }
      });
      return this;
    } catch (error) {
      throw new Error(`保存合约订单失败: ${error.message}`);
    }
  }

  // 更新订单状态
  async updateStatus(status, entryPrice = null) {
    try {
      const updateData = {
        status: status,
        updated_at: new Date()
      };
      
      if (entryPrice) {
        updateData.entry_price = entryPrice;
      }
      
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
        operation: 'update',
        recordId: this.id,
        data: updateData
      });
      
      this.status = status;
      if (entryPrice) {
        this.entryPrice = entryPrice;
      }
      this.updatedAt = new Date();
      return true;
    } catch (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }
  }

  // 更新平仓信息
  async updateExitInfo(exitPrice, profitLoss) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
        operation: 'update',
        recordId: this.id,
        data: {
          status: 'CLOSED',
          exit_price: exitPrice,
          profit_loss: profitLoss,
          updated_at: new Date()
        }
      });
      
      this.status = 'CLOSED';
      this.exitPrice = exitPrice;
      this.profitLoss = profitLoss;
      this.updatedAt = new Date();
      return true;
    } catch (error) {
      throw new Error(`更新平仓信息失败: ${error.message}`);
    }
  }

  // 根据ID查找订单
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
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

  // 根据用户ID查找订单
  static async findByUserId(userId, limit = 50) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`,
          sort: [{ field: 'created_at', order: 'desc' }],
          take: limit
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }

  // 根据状态查找订单
  static async findByStatus(status) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'contractOrders',
        operation: 'select',
        params: {
          filter: `status = '${status}'`
        }
      });
      
      return result.records ? result.records.map(record => record.fields) : [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContractOrder;