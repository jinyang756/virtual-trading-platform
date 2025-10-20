/**
 * 收益风险分析模型
 */

const dbAdapter = require('../database/dbAdapter');

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
    try {
      // 计算日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // 获取用户交易记录
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND timestamp >= '${startDate.toISOString()}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        // 获取用户账户信息
        const userResult = await dbAdapter.executeQuery({
          table: 'users',
          operation: 'select',
          params: {
            filter: `id = '${userId}'`
          }
        });
        
        const user = userResult.records && userResult.records.length > 0 ? userResult.records[0].fields : null;
        const accountValue = user ? user.balance : 0;
        
        // 按日期分组计算每日盈亏
        const dateMap = {};
        trades.forEach(trade => {
          const date = new Date(trade.timestamp).toISOString().split('T')[0];
          if (!dateMap[date]) {
            dateMap[date] = 0;
          }
          
          if (trade.type === 'SELL') {
            // 简化处理：假设买入价格为当前价格的95%
            const buyPrice = trade.price * 0.95;
            const pnl = (trade.price - buyPrice) * trade.quantity;
            dateMap[date] += pnl;
          }
        });
        
        // 计算每日收益率
        const returns = Object.keys(dateMap).map(date => {
          const dailyPnl = dateMap[date];
          const returnRate = accountValue > 0 ? (dailyPnl / accountValue) : 0;
          
          return {
            date: date,
            daily_pnl: dailyPnl,
            account_value: accountValue,
            return_rate: returnRate
          };
        });
        
        return returns;
      }
      
      return [];
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
    try {
      // 计算日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // 获取用户交易记录
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND timestamp >= '${startDate.toISOString()}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        // 获取用户账户信息
        const userResult = await dbAdapter.executeQuery({
          table: 'users',
          operation: 'select',
          params: {
            filter: `id = '${userId}'`
          }
        });
        
        const user = userResult.records && userResult.records.length > 0 ? userResult.records[0].fields : null;
        const accountValue = user ? user.balance : 0;
        
        // 按日期分组
        const dateMap = {};
        trades.forEach(trade => {
          const date = new Date(trade.timestamp).toISOString().split('T')[0];
          if (!dateMap[date]) {
            dateMap[date] = accountValue;
          }
        });
        
        // 转换为数组并排序
        const history = Object.keys(dateMap).map(date => ({
          date: date,
          account_value: dateMap[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return history;
      }
      
      // 如果没有交易记录，返回当前账户价值
      const userResult = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'select',
        params: {
          filter: `id = '${userId}'`
        }
      });
      
      const user = userResult.records && userResult.records.length > 0 ? userResult.records[0].fields : null;
      const accountValue = user ? user.balance : 0;
      
      return [{
        date: new Date().toISOString().split('T')[0],
        account_value: accountValue
      }];
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