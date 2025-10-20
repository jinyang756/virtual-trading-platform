/**
 * 交易分析模型
 */

const dbAdapter = require('../database/dbAdapter');

class TradeAnalysis {
  // 计算用户的交易统计数据
  static async getUserTradeStats(userId) {
    try {
      // 获取用户的所有交易记录
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        const totalTrades = trades.length;
        const buyTrades = trades.filter(trade => trade.type === 'buy').length;
        const sellTrades = trades.filter(trade => trade.type === 'sell').length;
        const avgQuantity = trades.reduce((sum, trade) => sum + trade.quantity, 0) / totalTrades;
        const avgPrice = trades.reduce((sum, trade) => sum + trade.price, 0) / totalTrades;
        const firstTrade = new Date(Math.min(...trades.map(trade => new Date(trade.timestamp))));
        const lastTrade = new Date(Math.max(...trades.map(trade => new Date(trade.timestamp))));
        
        return {
          total_trades: totalTrades,
          buy_trades: buyTrades,
          sell_trades: sellTrades,
          avg_quantity: avgQuantity,
          avg_price: avgPrice,
          first_trade: firstTrade,
          last_trade: lastTrade
        };
      }
      
      return {
        total_trades: 0,
        buy_trades: 0,
        sell_trades: 0,
        avg_quantity: 0,
        avg_price: 0,
        first_trade: null,
        last_trade: null
      };
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的盈亏统计数据
  static async getUserProfitStats(userId) {
    try {
      // 获取合约订单
      const contractResult = await dbAdapter.executeQuery({
        table: 'contract_orders',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND status = 'CLOSED'`
        }
      });
      
      // 获取二元期权订单
      const binaryResult = await dbAdapter.executeQuery({
        table: 'binary_orders',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}' AND status = 'SETTLED'`
        }
      });
      
      const contractTrades = contractResult.records ? contractResult.records.map(record => record.fields) : [];
      const binaryTrades = binaryResult.records ? binaryResult.records.map(record => record.fields) : [];
      
      // 计算合约订单盈亏
      const contractProfits = contractTrades.map(trade => {
        if (trade.exit_price && trade.entry_price) {
          return (trade.exit_price - trade.entry_price) * trade.amount;
        }
        return 0;
      });
      
      // 计算二元期权订单盈亏
      const binaryProfits = binaryTrades.map(trade => trade.payout || 0);
      
      // 合并所有盈亏数据
      const allProfits = [...contractProfits, ...binaryProfits];
      
      const winningTrades = allProfits.filter(profit => profit > 0).length;
      const losingTrades = allProfits.filter(profit => profit < 0).length;
      const totalProfit = allProfits.filter(profit => profit > 0).reduce((sum, profit) => sum + profit, 0);
      const totalLoss = Math.abs(allProfits.filter(profit => profit < 0).reduce((sum, profit) => sum + profit, 0));
      const avgProfitLoss = allProfits.length > 0 ? allProfits.reduce((sum, profit) => sum + profit, 0) / allProfits.length : 0;
      const maxProfit = allProfits.length > 0 ? Math.max(...allProfits) : 0;
      const maxLoss = allProfits.length > 0 ? Math.min(...allProfits) : 0;
      
      return {
        winning_trades: winningTrades,
        losing_trades: losingTrades,
        total_profit: totalProfit,
        total_loss: totalLoss,
        avg_profit_loss: avgProfitLoss,
        max_profit: maxProfit,
        max_loss: maxLoss
      };
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的资产分布
  static async getUserAssetDistribution(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        // 按资产分组
        const assetMap = {};
        trades.forEach(trade => {
          if (!assetMap[trade.asset]) {
            assetMap[trade.asset] = {
              trade_count: 0,
              total_value: 0
            };
          }
          assetMap[trade.asset].trade_count++;
          assetMap[trade.asset].total_value += trade.quantity * trade.price;
        });
        
        // 转换为数组并排序
        const distribution = Object.keys(assetMap).map(asset => ({
          asset: asset,
          trade_count: assetMap[asset].trade_count,
          total_value: assetMap[asset].total_value
        })).sort((a, b) => b.total_value - a.total_value);
        
        return distribution;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 计算用户的交易时间分布
  static async getUserTimeDistribution(userId) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select',
        params: {
          filter: `user_id = '${userId}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        // 按小时分组
        const hourMap = {};
        trades.forEach(trade => {
          const hour = new Date(trade.timestamp).getHours();
          if (!hourMap[hour]) {
            hourMap[hour] = 0;
          }
          hourMap[hour]++;
        });
        
        // 转换为数组并排序
        const distribution = Object.keys(hourMap).map(hour => ({
          hour: parseInt(hour),
          trade_count: hourMap[hour]
        })).sort((a, b) => a.hour - b.hour);
        
        return distribution;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // 获取最受欢迎的交易资产
  static async getPopularAssets(limit = 10) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'transactions',
        operation: 'select'
      });
      
      if (result.records && result.records.length > 0) {
        const trades = result.records.map(record => record.fields);
        
        // 按资产分组
        const assetMap = {};
        const userMap = {};
        
        trades.forEach(trade => {
          if (!assetMap[trade.asset]) {
            assetMap[trade.asset] = {
              trade_count: 0,
              user_ids: new Set()
            };
          }
          assetMap[trade.asset].trade_count++;
          assetMap[trade.asset].user_ids.add(trade.user_id);
        });
        
        // 转换为数组并排序
        const popularAssets = Object.keys(assetMap).map(asset => ({
          asset: asset,
          trade_count: assetMap[asset].trade_count,
          user_count: assetMap[asset].user_ids.size
        })).sort((a, b) => b.trade_count - a.trade_count).slice(0, limit);
        
        return popularAssets;
      }
      
      return [];
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