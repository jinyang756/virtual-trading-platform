const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const { generateId } = require('../utils/codeGenerator');
const BinaryOrder = require('../models/BinaryOrder');

class BinaryOptionEngine {
  /**
   * 二元期权交易引擎
   * 支持看涨看跌，固定收益1.95倍
   */
  constructor() {
    this.strategies = {
      "BINARY_1MIN": {
        "name": "1分钟二元期权",
        "duration": 60,  // 60秒
        "payout": 1.95,  // 收益倍数
        "max_investment": 10000
      },
      "BINARY_5MIN": {
        "name": "5分钟二元期权", 
        "duration": 300,  // 300秒
        "payout": 1.85,
        "max_investment": 50000
      },
      "BINARY_15MIN": {
        "name": "15分钟二元期权",
        "duration": 900,
        "payout": 1.75,
        "max_investment": 100000
      },
      "BINARY_30MIN": {
        "name": "30分钟二元期权",
        "duration": 1800,
        "payout": 1.70,
        "max_investment": 200000
      },
      "BINARY_1HOUR": {
        "name": "1小时二元期权",
        "duration": 3600,
        "payout": 1.65,
        "max_investment": 500000
      },
      "BINARY_TURBO": {
        "name": "极速二元期权(30秒)",
        "duration": 30,
        "payout": 2.00,
        "max_investment": 5000
      }
    };
    
    // 基础价格参考（基于合约价格）
    this.basePrice = 1000;
    
    // 历史统计数据
    this.statisticsHistory = {};
    
    // 活跃订单
    this.activeOrders = {};
    
    // 订单历史
    this.orderHistory = [];
    
    // 订单计数器
    this.orderCounter = 0;
    
    // 生成历史统计数据
    this._generateHistoricalStatistics();
    
    // 启动结算监控
    this._startSettlementMonitor();
  }
  
  _generateHistoricalStatistics() {
    /** 生成历史统计数据 */
    const startDate = new Date('2025-08-01');
    const endDate = new Date('2025-10-17');
    const currentDate = new Date(startDate);
    
    // 初始化统计数据
    let totalOrders = 0;
    let winOrders = 0;
    let totalInvestment = 0;
    let totalPayout = 0;
    
    // 为每个日期生成统计数据
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // 模拟在政策红利影响下的偏暖行情
      // 在8月1日到9月1日期间，增加盈利概率
      const isPolicyBoostPeriod = currentDate < new Date('2025-09-01');
      
      // 生成每日交易数据
      const dailyOrders = Math.floor(Math.random() * 20) + 10; // 每日10-30个订单
      let dailyWinOrders = 0;
      let dailyInvestment = 0;
      let dailyPayout = 0;
      
      // 生成每个订单的结果
      for (let i = 0; i < dailyOrders; i++) {
        const investment = Math.floor(Math.random() * 1000) + 100; // 投资100-1100
        dailyInvestment += investment;
        
        // 在政策红利期间增加盈利概率
        const winProbability = isPolicyBoostPeriod ? 0.55 : 0.48; // 48%-55%胜率
        const isWin = Math.random() < winProbability;
        
        if (isWin) {
          dailyWinOrders++;
          const payout = investment * this.strategies.BINARY_1MIN.payout;
          dailyPayout += payout;
        }
      }
      
      // 更新累计数据
      totalOrders += dailyOrders;
      winOrders += dailyWinOrders;
      totalInvestment += dailyInvestment;
      totalPayout += dailyPayout;
      
      // 记录每日统计数据
      this.statisticsHistory[dateStr] = {
        "total_orders": totalOrders,
        "win_orders": winOrders,
        "lose_orders": totalOrders - winOrders,
        "win_rate": totalOrders > 0 ? Math.round((winOrders / totalOrders) * 10000) / 100 : 0,
        "total_investment": Math.round(totalInvestment * 100) / 100,
        "total_payout": Math.round(totalPayout * 100) / 100,
        "net_profit": Math.round((totalPayout - totalInvestment) * 100) / 100
      };
      
      // 移动到下一天
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  _startSettlementMonitor() {
    /** 启动结算监控 */
    setInterval(() => {
      this._checkExpiredOrders();
    }, 1000); // 每秒检查一次
  }
  
  getStrategies() {
    /** 获取所有交易策略 */
    const strategies = [];
    for (const strategyId in this.strategies) {
      const config = this.strategies[strategyId];
      strategies.push({
        "strategy_id": strategyId,
        "name": config.name,
        "duration": config.duration,
        "payout": config.payout,
        "max_investment": config.max_investment
      });
    }
    return strategies;
  }
  
  getCurrentTrend() {
    /** 获取当前市场趋势 */
    // 模拟市场趋势，基于随机数
    const trendValue = Math.random();
    
    let trend, trendText;
    if (trendValue > 0.6) {
      trend = "strong_bullish";
      trendText = "强势看涨";
    } else if (trendValue > 0.55) {
      trend = "bullish"; 
      trendText = "看涨";
    } else if (trendValue < 0.4) {
      trend = "strong_bearish";
      trendText = "强势看跌";
    } else if (trendValue < 0.45) {
      trend = "bearish";
      trendText = "看跌";
    } else {
      trend = "neutral";
      trendText = "震荡";
    }
    
    return {
      "trend": trend,
      "trend_text": trendText,
      "confidence": Math.round(Math.abs(trendValue - 0.5) * 2000) / 10,  // 置信度
      "timestamp": new Date()
    };
  }
  
  placeBinaryOrder(userId, strategyId, direction, investment) {
    /** 下二元期权订单 */
    if (!this.strategies[strategyId]) {
      return {"success": false, "error": "交易策略不存在"};
    }
    
    if (direction !== "call" && direction !== "put") {
      return {"success": false, "error": "交易方向错误，必须是call或put"};
    }
    
    const strategyConfig = this.strategies[strategyId];
    
    // 检查投资限额
    if (investment > strategyConfig.max_investment) {
      return {"success": false, "error": `超过最大投资限额${strategyConfig.max_investment}`};
    }
    
    if (investment <= 0) {
      return {"success": false, "error": "投资金额必须大于0"};
    }
    
    // 生成订单ID
    this.orderCounter += 1;
    const orderId = `BINARY_${this.orderCounter}`;
    
    // 获取当前趋势和价格作为基准
    const currentTrend = this.getCurrentTrend();
    const entryPrice = this._generateEntryPrice();
    
    // 创建订单
    const order = {
      "order_id": orderId,
      "user_id": userId,
      "strategy_id": strategyId,
      "strategy_name": strategyConfig.name,
      "direction": direction,
      "investment": investment,
      "entry_price": entryPrice,
      "potential_payout": investment * strategyConfig.payout,
      "order_time": new Date(),
      "expire_time": new Date(Date.now() + strategyConfig.duration * 1000),
      "status": "active",
      "trend_at_order": currentTrend
    };
    
    // 保存订单
    this.activeOrders[orderId] = order;
    
    return {
      "success": true,
      "order_id": orderId,
      "message": `二元期权订单创建成功: ${direction} ${strategyConfig.name}`,
      "investment": investment,
      "potential_payout": investment * strategyConfig.payout,
      "expire_time": order.expire_time,
      "countdown": strategyConfig.duration
    };
  }
  
  _generateEntryPrice() {
    /** 生成入场价格 */
    // 基于基础价格加上随机波动
    const volatility = this._getRandomNormal(0, 0.02);  // 2%波动
    return Math.round(this.basePrice * (1 + volatility) * 100) / 100;
  }
  
  _generateSettlementPrice() {
    /** 生成结算价格 */
    // 结算价格基于入场价格加上更大波动
    const volatility = this._getRandomNormal(0, 0.05);  // 5%波动
    return Math.round(this.basePrice * (1 + volatility) * 100) / 100;
  }
  
  _getRandomNormal(mean, stdDev) {
    /** 生成正态分布随机数 */
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num * stdDev + mean;
    return num;
  }
  
  _checkExpiredOrders() {
    /** 检查过期订单并进行结算 */
    const currentTime = new Date();
    const expiredOrders = [];
    
    // 找出过期的订单
    for (const orderId in this.activeOrders) {
      const order = this.activeOrders[orderId];
      if (currentTime >= order.expire_time && order.status === "active") {
        expiredOrders.push(orderId);
      }
    }
    
    // 结算过期订单
    for (const orderId of expiredOrders) {
      this._settleOrder(orderId);
    }
  }
  
  _settleOrder(orderId) {
    /** 结算订单 */
    if (!this.activeOrders[orderId]) {
      return;
    }
    
    const order = this.activeOrders[orderId];
    
    // 生成结算价格
    const settlePrice = this._generateSettlementPrice();
    
    // 判断盈亏
    const entryPrice = order.entry_price;
    const direction = order.direction;
    
    let isWin = false;
    if (direction === "call" && settlePrice > entryPrice) {
      isWin = true;
    } else if (direction === "put" && settlePrice < entryPrice) {
      isWin = true;
    }
    
    // 计算盈亏
    let payout, profit, status;
    if (isWin) {
      payout = order.investment * this.strategies[order.strategy_id].payout;
      profit = payout - order.investment;
      status = "win";
    } else {
      payout = 0;
      profit = -order.investment;
      status = "lose";
    }
    
    // 更新订单状态
    order.status = "settled";
    order.settle_price = settlePrice;
    order.payout = payout;
    order.profit = profit;
    order.result = status;
    order.settle_time = new Date();
    
    // 移动到历史记录
    this.orderHistory.push(order);
    delete this.activeOrders[orderId];
    
    console.log(`订单 ${orderId} 已结算: ${status}, 盈亏: ${profit}`);
  }
  
  getActiveOrders(userId) {
    /** 获取用户活跃订单 */
    const userOrders = [];
    for (const orderId in this.activeOrders) {
      const order = this.activeOrders[orderId];
      if (order.user_id === userId) {
        // 计算剩余时间
        const remaining = (order.expire_time - new Date()) / 1000;
        const orderData = {...order};
        orderData.remaining_seconds = Math.max(0, Math.floor(remaining));
        userOrders.push(orderData);
      }
    }
    
    return userOrders.sort((a, b) => a.expire_time - b.expire_time);
  }
  
  getOrderHistory(userId, limit = 50) {
    /** 获取用户订单历史 */
    const userOrders = this.orderHistory.filter(order => order.user_id === userId);
    return userOrders.sort((a, b) => b.settle_time - a.settle_time).slice(0, limit);
  }
  
  getBinaryStatistics(userId) {
    /** 获取二元期权统计 */
    const userOrders = this.orderHistory.filter(order => order.user_id === userId);
    
    if (userOrders.length === 0) {
      return {
        "total_orders": 0,
        "win_orders": 0,
        "lose_orders": 0,
        "win_rate": 0,
        "total_investment": 0,
        "total_payout": 0,
        "net_profit": 0
      };
    }
    
    const totalOrders = userOrders.length;
    const winOrders = userOrders.filter(order => order.result === "win").length;
    const loseOrders = totalOrders - winOrders;
    const winRate = (winOrders / totalOrders) * 100;
    
    const totalInvestment = userOrders.reduce((sum, order) => sum + order.investment, 0);
    const totalPayout = userOrders.reduce((sum, order) => sum + order.payout, 0);
    const netProfit = totalPayout - totalInvestment;
    
    return {
      "total_orders": totalOrders,
      "win_orders": winOrders,
      "lose_orders": loseOrders,
      "win_rate": Math.round(winRate * 100) / 100,
      "total_investment": Math.round(totalInvestment * 100) / 100,
      "total_payout": Math.round(totalPayout * 100) / 100,
      "net_profit": Math.round(netProfit * 100) / 100
    };
  }
  
  getHistoricalStatistics(startDate, endDate) {
    /** 获取历史统计数据 */
    if (!startDate && !endDate) {
      return this.statisticsHistory;
    }
    
    // 过滤指定日期范围内的数据
    const start = startDate ? new Date(startDate) : new Date('2025-08-01');
    const end = endDate ? new Date(endDate) : new Date('2025-10-17');
    
    const result = {};
    for (const dateStr in this.statisticsHistory) {
      const date = new Date(dateStr);
      if (date >= start && date <= end) {
        result[dateStr] = this.statisticsHistory[dateStr];
      }
    }
    
    return result;
  }
  
  updateBasePrice(newPrice) {
    /** 更新基础价格（从合约引擎获取） */
    this.basePrice = newPrice;
  }
}

module.exports = BinaryOptionEngine;