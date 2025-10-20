/**
 * 投资组合分析模型
 */

const dbAdapter = require('../database/dbAdapter');

class PortfolioAnalysis {
  // 获取用户当前持仓
  static async getCurrentPositions(userId) {
    try {
      // 获取用户持仓
      const positionResult = await dbAdapter.executeQuery({
        table: 'positions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      if (positionResult.records && positionResult.records.length > 0) {
        const positions = positionResult.records.map(record => record.fields);
        
        // 为简化实现，使用模拟的当前价格
        // 在实际应用中，这里应该从市场数据API获取实时价格
        const positionsWithMarketData = positions.map(position => {
          // 模拟当前价格（在实际应用中应该从市场数据获取）
          const currentPrice = position.avg_price * (1 + (Math.random() - 0.5) * 0.1); // 随机波动±5%
          
          const marketValue = position.quantity * currentPrice;
          const unrealizedPnl = marketValue - (position.quantity * position.avg_price);
          const pnlPercentage = ((marketValue - (position.quantity * position.avg_price)) / (position.quantity * position.avg_price)) * 100;
          
          return {
            asset: position.asset,
            quantity: position.quantity,
            avg_price: position.avg_price,
            current_price: currentPrice,
            market_value: marketValue,
            unrealized_pnl: unrealizedPnl,
            pnl_percentage: pnlPercentage
          };
        });
        
        // 按市场价值降序排列
        return positionsWithMarketData.sort((a, b) => b.market_value - a.market_value);
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 计算投资组合总价值
  static async calculatePortfolioValue(userId) {
    try {
      const positions = await this.getCurrentPositions(userId);
      
      if (positions.length > 0) {
        const totalValue = positions.reduce((sum, pos) => sum + pos.market_value, 0);
        const costBasis = positions.reduce((sum, pos) => sum + (pos.quantity * pos.avg_price), 0);
        const totalPnl = totalValue - costBasis;
        
        return {
          total_value: totalValue,
          cost_basis: costBasis,
          total_pnl: totalPnl
        };
      }
      
      return {
        total_value: 0,
        cost_basis: 0,
        total_pnl: 0
      };
    } catch (error) {
      throw error;
    }
  }

  // 计算资产配置分布
  static async getAssetAllocation(userId) {
    try {
      const positions = await this.getCurrentPositions(userId);
      
      if (positions.length > 0) {
        const totalValue = positions.reduce((sum, pos) => sum + pos.market_value, 0);
        
        // 按资产分组计算配置
        const assetMap = {};
        positions.forEach(pos => {
          if (!assetMap[pos.asset]) {
            assetMap[pos.asset] = 0;
          }
          assetMap[pos.asset] += pos.market_value;
        });
        
        // 转换为数组并计算百分比
        const allocation = Object.keys(assetMap).map(asset => {
          const marketValue = assetMap[asset];
          const allocationPercentage = (marketValue / totalValue) * 100;
          
          return {
            asset: asset,
            market_value: marketValue,
            allocation_percentage: allocationPercentage
          };
        }).sort((a, b) => b.market_value - a.market_value);
        
        return allocation;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 计算投资组合风险指标
  static async calculatePortfolioRisk(userId) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  // 计算投资组合波动率（简化版）
  static calculatePortfolioVolatility(positions, weights) {
    // 这里使用简化的计算方法
    // 实际应用中需要基于历史数据计算协方差矩阵
    if (weights.length === 0) return 0;
    
    const avgWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const variance = weights.reduce((sum, weight) => sum + Math.pow(weight - avgWeight, 2), 0) / weights.length;
    return Math.sqrt(variance) * 100;
  }

  // 计算最大回撤（简化版）
  static calculateMaxDrawdown(positions) {
    // 这里使用简化的计算方法
    // 实际应用中需要基于历史净值计算
    if (positions.length === 0) return 0;
    
    const pnlPercentages = positions.map(pos => pos.pnl_percentage || 0);
    const minPnl = Math.min(...pnlPercentages);
    return Math.abs(minPnl);
  }

  // 获取投资组合历史表现
  static async getPortfolioHistory(userId, days = 30) {
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
        
        // 按日期分组计算每日价值
        const dateMap = {};
        trades.forEach(trade => {
          const date = new Date(trade.timestamp).toISOString().split('T')[0];
          if (!dateMap[date]) {
            dateMap[date] = 0;
          }
          dateMap[date] += trade.quantity * trade.price;
        });
        
        // 转换为数组并排序
        const history = Object.keys(dateMap).map(date => ({
          date: date,
          daily_value: dateMap[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return history;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PortfolioAnalysis;