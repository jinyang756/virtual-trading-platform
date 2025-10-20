/**
 * 收益风险分析模型
 */

const { executeQuery } = require('../database/connection');

class RiskAnalysis {
  // 计算夏普比率
  static async calculateSharpeRatio(userId, riskFreeRate = 0.02) {
    // 获取用户收益率数据
    const returns = await this.getUserReturns(userId);
    
    if (returns.length === 0) {
      return 0;
    }
    
    // 计算平均收益率
    const avgReturn = returns.reduce((sum, ret) => sum + ret.return_rate, 0) / returns.length;
    
    // 计算收益率标准差
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret.return_rate - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    // 计算夏普比率
    if (stdDev === 0) return 0;
    return (avgReturn - riskFreeRate/252) / stdDev; // 日度数据，年化风险溢价
  }

  // 获取用户收益率数据
  static async getUserReturns(userId, days = 30) {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        SUM(CASE WHEN type = 'SELL' THEN (price - (SELECT AVG(price) FROM transactions t2 WHERE t2.user_id = ? AND t2.asset = t1.asset AND t2.type = 'BUY' AND t2.timestamp < t1.timestamp LIMIT 1)) * quantity ELSE 0 END) as daily_pnl,
        (SELECT balance FROM users WHERE id = ?) as account_value
      FROM transactions t1
      WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date
    `;
    
    try {
      const results = await executeQuery(query, [userId, userId, userId, days]);
      
      // 计算每日收益率
      const returns = results.map(row => {
        const returnRate = row.account_value > 0 ? (row.daily_pnl / row.account_value) : 0;
        return {
          date: row.date,
          daily_pnl: row.daily_pnl,
          account_value: row.account_value,
          return_rate: returnRate
        };
      });
      
      return returns;
    } catch (error) {
      throw error;
    }
  }

  // 计算最大回撤
  static async calculateMaxDrawdown(userId, days = 30) {
    // 获取账户历史净值
    const history = await this.getAccountHistory(userId, days);
    
    if (history.length === 0) {
      return 0;
    }
    
    let peak = history[0].account_value;
    let maxDrawdown = 0;
    
    for (let i = 1; i < history.length; i++) {
      if (history[i].account_value > peak) {
        peak = history[i].account_value;
      } else {
        const drawdown = (peak - history[i].account_value) / peak * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }
    
    return maxDrawdown;
  }

  // 获取账户历史净值
  static async getAccountHistory(userId, days = 30) {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        (SELECT balance FROM users WHERE id = ?) as account_value
      FROM transactions 
      WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date
    `;
    
    try {
      const results = await executeQuery(query, [userId, userId, days]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // 计算VaR (Value at Risk)
  static async calculateVaR(userId, confidenceLevel = 0.95, days = 30) {
    // 获取用户收益率数据
    const returns = await this.getUserReturns(userId, days);
    
    if (returns.length === 0) {
      return 0;
    }
    
    // 按收益率排序
    const sortedReturns = returns.map(r => r.return_rate).sort((a, b) => a - b);
    
    // 计算VaR位置
    const varIndex = Math.floor(sortedReturns.length * (1 - confidenceLevel));
    
    // 返回VaR值
    return Math.abs(sortedReturns[varIndex]);
  }

  // 获取用户风险指标概览
  static async getRiskOverview(userId) {
    const sharpeRatio = await this.calculateSharpeRatio(userId);
    const maxDrawdown = await this.calculateMaxDrawdown(userId);
    const varValue = await this.calculateVaR(userId);
    
    return {
      sharpe_ratio: parseFloat(sharpeRatio.toFixed(4)),
      max_drawdown: parseFloat(maxDrawdown.toFixed(2)),
      value_at_risk: parseFloat(varValue.toFixed(4)),
      risk_level: this.assessRiskLevel(sharpeRatio, maxDrawdown)
    };
  }

  // 评估风险等级
  static assessRiskLevel(sharpeRatio, maxDrawdown) {
    // 基于夏普比率和最大回撤评估风险等级
    if (sharpeRatio > 1.5 && maxDrawdown < 10) {
      return '低风险';
    } else if (sharpeRatio > 0.5 && maxDrawdown < 20) {
      return '中等风险';
    } else {
      return '高风险';
    }
  }

  // 计算贝塔系数（相对于市场）
  static async calculateBeta(userId) {
    // 简化的贝塔系数计算
    // 实际应用中需要市场基准数据
    return 1.0;
  }
}

module.exports = RiskAnalysis;