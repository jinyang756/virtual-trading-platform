/**
 * 交易分析模型
 */

const { executeQuery } = require('../database/connection');

class TradeAnalysis {
  // 计算用户的交易统计数据
  static async getUserTradeStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN type = 'BUY' THEN 1 ELSE 0 END) as buy_trades,
        SUM(CASE WHEN type = 'SELL' THEN 1 ELSE 0 END) as sell_trades,
        AVG(quantity) as avg_quantity,
        AVG(price) as avg_price,
        MIN(timestamp) as first_trade,
        MAX(timestamp) as last_trade
      FROM transactions 
      WHERE user_id = ?
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的盈亏统计数据
  static async getUserProfitStats(userId) {
    const query = `
      SELECT 
        SUM(CASE WHEN profit_loss > 0 THEN 1 ELSE 0 END) as winning_trades,
        SUM(CASE WHEN profit_loss < 0 THEN 1 ELSE 0 END) as losing_trades,
        SUM(CASE WHEN profit_loss > 0 THEN profit_loss ELSE 0 END) as total_profit,
        SUM(CASE WHEN profit_loss < 0 THEN ABS(profit_loss) ELSE 0 END) as total_loss,
        AVG(profit_loss) as avg_profit_loss,
        MAX(profit_loss) as max_profit,
        MIN(profit_loss) as max_loss
      FROM (
        SELECT 
          (exit_price - entry_price) * amount as profit_loss
        FROM contract_orders 
        WHERE user_id = ? AND status = 'CLOSED'
        UNION ALL
        SELECT 
          payout as profit_loss
        FROM binary_orders 
        WHERE user_id = ? AND status = 'SETTLED'
      ) as all_trades
    `;
    
    try {
      const results = await executeQuery(query, [userId, userId]);
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的资产分布
  static async getUserAssetDistribution(userId) {
    const query = `
      SELECT 
        asset,
        COUNT(*) as trade_count,
        SUM(quantity * price) as total_value
      FROM transactions 
      WHERE user_id = ?
      GROUP BY asset
      ORDER BY total_value DESC
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的交易时间分布
  static async getUserTimeDistribution(userId) {
    const query = `
      SELECT 
        HOUR(timestamp) as hour,
        COUNT(*) as trade_count
      FROM transactions 
      WHERE user_id = ?
      GROUP BY HOUR(timestamp)
      ORDER BY hour
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 获取最受欢迎的交易资产
  static async getPopularAssets(limit = 10) {
    const query = `
      SELECT 
        asset,
        COUNT(*) as trade_count,
        COUNT(DISTINCT user_id) as user_count
      FROM transactions 
      GROUP BY asset
      ORDER BY trade_count DESC
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [limit]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 计算交易胜率
  static async calculateWinRate(winningTrades, totalTrades) {
    if (totalTrades === 0) return 0;
    return (winningTrades / totalTrades) * 100;
  }

  // 计算盈亏比
  static async calculateProfitFactor(totalProfit, totalLoss) {
    if (totalLoss === 0) return totalProfit > 0 ? Infinity : 0;
    return totalProfit / totalLoss;
  }

  // 计算平均盈亏比
  static async calculateAvgProfitLossRatio(avgProfit, avgLoss) {
    if (avgLoss === 0) return avgProfit > 0 ? Infinity : 0;
    return Math.abs(avgProfit / avgLoss);
  }
}

module.exports = TradeAnalysis;