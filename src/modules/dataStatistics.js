/**
 * 数据统计报表模块
 * 生成详细的数据统计报表
 */

class DataStatistics {
  /**
   * 生成交易统计报表
   * @param {Array} tradeData - 交易数据
   * @returns {Object} 交易统计报表
   */
  generateTradeStatistics(tradeData) {
    const stats = {
      totalTrades: 0,
      totalVolume: 0,
      buyTrades: 0,
      sellTrades: 0,
      avgTradeSize: 0,
      successRate: 0,
      profitTrades: 0,
      lossTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0
    };
    
    if (!tradeData || tradeData.length === 0) {
      return stats;
    }
    
    stats.totalTrades = tradeData.length;
    
    let totalVolume = 0;
    let profitTrades = 0;
    let lossTrades = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    
    tradeData.forEach(trade => {
      // 计算总交易量
      totalVolume += (trade.amount || trade.quantity) * trade.price;
      
      // 统计买卖交易
      if (trade.direction === 'buy' || trade.type === 'buy') {
        stats.buyTrades++;
      } else if (trade.direction === 'sell' || trade.type === 'sell') {
        stats.sellTrades++;
      }
      
      // 计算盈亏（假设trade对象包含profit字段）
      if (trade.profit !== undefined) {
        if (trade.profit > 0) {
          profitTrades++;
          totalProfit += trade.profit;
        } else if (trade.profit < 0) {
          lossTrades++;
          totalLoss += Math.abs(trade.profit);
        }
      }
    });
    
    stats.totalVolume = totalVolume;
    stats.avgTradeSize = totalVolume / stats.totalTrades;
    stats.profitTrades = profitTrades;
    stats.lossTrades = lossTrades;
    stats.totalProfit = totalProfit;
    stats.totalLoss = totalLoss;
    stats.netProfit = totalProfit - totalLoss;
    stats.successRate = profitTrades / stats.totalTrades * 100;
    
    return stats;
  }

  /**
   * 生成用户统计报表
   * @param {Array} userData - 用户数据
   * @param {Array} tradeData - 交易数据
   * @returns {Object} 用户统计报表
   */
  generateUserStatistics(userData, tradeData) {
    const stats = {
      totalUsers: 0,
      activeUsers: 0,
      newUserCount: 0,
      userDistribution: {
        byRole: {},
        byStatus: {}
      },
      userActivity: {
        avgTradesPerUser: 0,
        mostActiveUser: null
      }
    };
    
    if (!userData || userData.length === 0) {
      return stats;
    }
    
    stats.totalUsers = userData.length;
    
    // 统计活跃用户（假设有lastLogin字段）
    const activeUsers = userData.filter(user => {
      if (user.lastLogin) {
        const lastLogin = new Date(user.lastLogin);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return lastLogin >= thirtyDaysAgo;
      }
      return false;
    });
    stats.activeUsers = activeUsers.length;
    
    // 统计新用户（假设用户有createdAt字段）
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    stats.newUserCount = userData.filter(user => {
      if (user.createdAt) {
        return new Date(user.createdAt) >= sevenDaysAgo;
      }
      return false;
    }).length;
    
    // 按角色统计用户
    userData.forEach(user => {
      const role = user.role || 'unknown';
      if (!stats.userDistribution.byRole[role]) {
        stats.userDistribution.byRole[role] = 0;
      }
      stats.userDistribution.byRole[role]++;
    });
    
    // 按状态统计用户
    userData.forEach(user => {
      const status = user.status || 'active';
      if (!stats.userDistribution.byStatus[status]) {
        stats.userDistribution.byStatus[status] = 0;
      }
      stats.userDistribution.byStatus[status]++;
    });
    
    // 计算用户活跃度
    if (tradeData && tradeData.length > 0) {
      // 按用户统计交易次数
      const tradesPerUser = {};
      tradeData.forEach(trade => {
        const userId = trade.userId;
        if (!tradesPerUser[userId]) {
          tradesPerUser[userId] = 0;
        }
        tradesPerUser[userId]++;
      });
      
      // 计算平均交易次数
      const totalTrades = Object.values(tradesPerUser).reduce((sum, count) => sum + count, 0);
      stats.userActivity.avgTradesPerUser = totalTrades / Object.keys(tradesPerUser).length;
      
      // 找到最活跃的用户
      let maxTrades = 0;
      let mostActiveUserId = null;
      for (const [userId, count] of Object.entries(tradesPerUser)) {
        if (count > maxTrades) {
          maxTrades = count;
          mostActiveUserId = userId;
        }
      }
      
      if (mostActiveUserId) {
        const mostActiveUser = userData.find(user => user.id === mostActiveUserId);
        stats.userActivity.mostActiveUser = {
          userId: mostActiveUserId,
          username: mostActiveUser ? mostActiveUser.username : 'Unknown',
          tradeCount: maxTrades
        };
      }
    }
    
    return stats;
  }

  /**
   * 生成资产统计报表
   * @param {Array} positionData - 持仓数据
   * @param {Array} marketData - 市场数据
   * @returns {Object} 资产统计报表
   */
  generateAssetStatistics(positionData, marketData) {
    const stats = {
      totalAssets: 0,
      assetDistribution: {},
      topAssets: [],
      performance: {
        bestPerforming: null,
        worstPerforming: null
      }
    };
    
    if (!positionData || positionData.length === 0) {
      return stats;
    }
    
    // 创建市场价格映射
    const priceMap = {};
    if (marketData) {
      marketData.forEach(asset => {
        priceMap[asset.symbol] = asset.price;
      });
    }
    
    // 按资产统计
    const assetStats = {};
    positionData.forEach(position => {
      const symbol = position.symbol;
      const currentPrice = priceMap[symbol] || position.current_price || 0;
      const value = (position.total_amount || position.amount) * currentPrice;
      const profit = position.floating_profit || 0;
      const profitPercent = position.profit_percent || 0;
      
      if (!assetStats[symbol]) {
        assetStats[symbol] = {
          symbol: symbol,
          name: position.name || symbol,
          totalValue: 0,
          totalProfit: 0,
          positionCount: 0,
          avgProfitPercent: 0
        };
      }
      
      assetStats[symbol].totalValue += value;
      assetStats[symbol].totalProfit += profit;
      assetStats[symbol].positionCount++;
      assetStats[symbol].avgProfitPercent = (assetStats[symbol].avgProfitPercent * (assetStats[symbol].positionCount - 1) + profitPercent) / assetStats[symbol].positionCount;
    });
    
    // 计算总资产
    stats.totalAssets = Object.values(assetStats).reduce((sum, asset) => sum + asset.totalValue, 0);
    
    // 资产分布
    for (const [symbol, asset] of Object.entries(assetStats)) {
      stats.assetDistribution[symbol] = {
        ...asset,
        percentage: (asset.totalValue / stats.totalAssets) * 100
      };
    }
    
    // 排序找出前5大资产
    stats.topAssets = Object.values(assetStats)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
    
    // 找出表现最好和最差的资产
    const assetsArray = Object.values(assetStats);
    if (assetsArray.length > 0) {
      stats.performance.bestPerforming = assetsArray.reduce((best, current) => 
        current.avgProfitPercent > best.avgProfitPercent ? current : best
      );
      
      stats.performance.worstPerforming = assetsArray.reduce((worst, current) => 
        current.avgProfitPercent < worst.avgProfitPercent ? current : worst
      );
    }
    
    return stats;
  }

  /**
   * 生成时间趋势报表
   * @param {Array} tradeData - 交易数据
   * @param {string} timeUnit - 时间单位 (day/week/month)
   * @returns {Object} 时间趋势报表
   */
  generateTrendStatistics(tradeData, timeUnit = 'day') {
    const stats = {
      timeUnit: timeUnit,
      data: []
    };
    
    if (!tradeData || tradeData.length === 0) {
      return stats;
    }
    
    // 按时间分组统计数据
    const timeGroups = {};
    
    tradeData.forEach(trade => {
      const timestamp = new Date(trade.timestamp || trade.order_time);
      let timeKey;
      
      switch (timeUnit) {
        case 'day':
          timeKey = timestamp.toISOString().split('T')[0];
          break;
        case 'week':
          // 计算周数
          const year = timestamp.getFullYear();
          const week = this._getWeekNumber(timestamp);
          timeKey = `${year}-W${week}`;
          break;
        case 'month':
          timeKey = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          timeKey = timestamp.toISOString().split('T')[0];
      }
      
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          date: timeKey,
          tradeCount: 0,
          totalVolume: 0,
          profit: 0
        };
      }
      
      timeGroups[timeKey].tradeCount++;
      timeGroups[timeKey].totalVolume += (trade.amount || trade.quantity) * trade.price;
      if (trade.profit !== undefined) {
        timeGroups[timeKey].profit += trade.profit;
      }
    });
    
    // 转换为数组并按时间排序
    stats.data = Object.values(timeGroups).sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
    
    return stats;
  }

  /**
   * 生成综合统计报表
   * @param {Object} data - 所有数据
   * @returns {Object} 综合统计报表
   */
  generateComprehensiveReport(data) {
    const report = {
      generatedAt: new Date(),
      period: data.period || 'all_time',
      tradeStats: this.generateTradeStatistics(data.trades),
      userStats: this.generateUserStatistics(data.users, data.trades),
      assetStats: this.generateAssetStatistics(data.positions, data.marketData),
      trendStats: this.generateTrendStatistics(data.trades, 'day')
    };
    
    return report;
  }

  /**
   * 获取周数
   * @param {Date} date - 日期
   * @returns {number} 周数
   */
  _getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

module.exports = DataStatistics;