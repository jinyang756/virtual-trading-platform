/**
 * 投资组合分析模型
 */

const { executeQuery } = require('../database/connection');

class PortfolioAnalysis {
  // 获取用户当前持仓
  static async getCurrentPositions(userId) {
    const query = `
      SELECT 
        p.asset,
        p.quantity,
        p.avg_price,
        m.current_price,
        (p.quantity * m.current_price) as market_value,
        (p.quantity * m.current_price - p.quantity * p.avg_price) as unrealized_pnl,
        ((p.quantity * m.current_price - p.quantity * p.avg_price) / (p.quantity * p.avg_price) * 100) as pnl_percentage
      FROM positions p
      JOIN market_data m ON p.asset = m.symbol
      WHERE p.user_id = ?
      ORDER BY market_value DESC
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 计算投资组合总价值
  static async calculatePortfolioValue(userId) {
    const query = `
      SELECT 
        SUM(p.quantity * m.current_price) as total_value,
        SUM(p.quantity * p.avg_price) as cost_basis,
        SUM(p.quantity * m.current_price - p.quantity * p.avg_price) as total_pnl
      FROM positions p
      JOIN market_data m ON p.asset = m.symbol
      WHERE p.user_id = ?
    `;
    
    try {
      const results = await executeQuery(query, [userId]);
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  // 计算资产配置分布
  static async getAssetAllocation(userId) {
    const query = `
      SELECT 
        p.asset,
        SUM(p.quantity * m.current_price) as market_value,
        (SUM(p.quantity * m.current_price) / (SELECT SUM(p2.quantity * m2.current_price) 
          FROM positions p2 
          JOIN market_data m2 ON p2.asset = m2.symbol 
          WHERE p2.user_id = ?)) * 100 as allocation_percentage
      FROM positions p
      JOIN market_data m ON p.asset = m.symbol
      WHERE p.user_id = ?
      GROUP BY p.asset, m.current_price
      ORDER BY market_value DESC
    `;
    
    try {
      const results = await executeQuery(query, [userId, userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 计算投资组合风险指标
  static async calculatePortfolioRisk(userId) {
    const positions = await this.getCurrentPositions(userId);
    
    if (positions.length === 0) {
      return {
        total_value: 0,
        volatility: 0,
        max_drawdown: 0,
        sharpe_ratio: 0
      };
    }
    
    // 计算总投资价值
    const totalValue = positions.reduce((sum, pos) => sum + pos.market_value, 0);
    
    // 计算权重
    const weights = positions.map(pos => pos.market_value / totalValue);
    
    // 简化的风险计算（实际应用中需要更复杂的计算）
    const volatility = this.calculatePortfolioVolatility(positions, weights);
    const maxDrawdown = this.calculateMaxDrawdown(positions);
    
    return {
      total_value: totalValue,
      volatility: volatility,
      max_drawdown: maxDrawdown,
      position_count: positions.length
    };
  }

  // 计算投资组合波动率（简化版）
  static calculatePortfolioVolatility(positions, weights) {
    // 这里使用简化的计算方法
    // 实际应用中需要基于历史数据计算协方差矩阵
    const avgWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const variance = weights.reduce((sum, weight) => sum + Math.pow(weight - avgWeight, 2), 0) / weights.length;
    return Math.sqrt(variance) * 100;
  }

  // 计算最大回撤（简化版）
  static calculateMaxDrawdown(positions) {
    // 这里使用简化的计算方法
    // 实际应用中需要基于历史净值计算
    const pnlPercentages = positions.map(pos => pos.pnl_percentage || 0);
    if (pnlPercentages.length === 0) return 0;
    
    const minPnl = Math.min(...pnlPercentages);
    return Math.abs(minPnl);
  }

  // 获取投资组合历史表现
  static async getPortfolioHistory(userId, days = 30) {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        SUM(quantity * price) as daily_value
      FROM transactions 
      WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date
    `;
    
    try {
      const results = await executeQuery(query, [userId, days]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PortfolioAnalysis;