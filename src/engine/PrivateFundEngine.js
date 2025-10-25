const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const { generateId } = require('../utils/codeGenerator');
const FundTransaction = require('../models/FundTransaction');
const FundPosition = require('../models/FundPosition');

class PrivateFundEngine {
  /**
   * 私募基金交易引擎
   * 支持基金认购、赎回、净值管理
   */
  constructor() {
    try {
      this.funds = {
        "FUND_K8": {
          "name": "聚财日斗K8基金",
          "fund_manager": "日斗投资",
          "risk_level": "中等",  // 低、中等、高
          "min_investment": 10000,
          "management_fee": 0.015,  // 1.5%
          "performance_fee": 0.20,  // 20%
          "nav": 1.0  // 初始净值
        },
        "FUND_A1": {
          "name": "聚财银河A1基金",
          "fund_manager": "银河资产", 
          "risk_level": "高",
          "min_investment": 50000,
          "management_fee": 0.02,
          "performance_fee": 0.25,
          "nav": 1.0
        },
        "FUND_FIRE": {
          "name": "聚财幻方萤火基金",
          "fund_manager": "幻方量化",
          "risk_level": "中等",
          "min_investment": 100000,
          "management_fee": 0.01,
          "performance_fee": 0.15,
          "nav": 1.0
        },
        "FUND_QUANT": {
          "name": "聚财量化基金",
          "fund_manager": "聚财量化",
          "risk_level": "低",
          "min_investment": 5000,
          "management_fee": 0.008,
          "performance_fee": 0.10,
          "nav": 1.0
        },
        "FUND_STABLE": {
          "name": "聚财稳健增长基金",
          "fund_manager": "稳健投资",
          "risk_level": "低",
          "min_investment": 10000,
          "management_fee": 0.012,
          "performance_fee": 0.08,
          "nav": 1.0
        },
        "FUND_GROWTH": {
          "name": "聚财成长优选基金",
          "fund_manager": "成长投资",
          "risk_level": "中等",
          "min_investment": 20000,
          "management_fee": 0.018,
          "performance_fee": 0.15,
          "nav": 1.0
        },
        "FUND_BALANCED": {
          "name": "聚财平衡配置基金",
          "fund_manager": "平衡投资",
          "risk_level": "中等",
          "min_investment": 15000,
          "management_fee": 0.015,
          "performance_fee": 0.12,
          "nav": 1.0
        }
      };
      
      // 净值历史
      this.navHistory = {};
      
      // 交易记录和持仓
      this.transactions = [];
      this.positions = {};
      this.userPositions = {};
      
      // 初始化净值历史
      this._initializeNavHistory();
      
      // 生成历史数据
      this._generateHistoricalData();
    } catch (error) {
      console.error('私募基金引擎初始化失败:', error);
      throw error;
    }
  }
  
  _initializeNavHistory() {
    try {
      /** 初始化净值历史 */
      for (const fundId in this.funds) {
        this.navHistory[fundId] = [{
          "date": new Date().toISOString().split('T')[0],
          "nav": this.funds[fundId].nav,
          "change": 0.0
        }];
      }
    } catch (error) {
      console.error('初始化净值历史失败:', error);
    }
  }
  
  _generateHistoricalData() {
    try {
      /** 生成历史数据 */
      const startDate = new Date('2025-08-01');
      const endDate = new Date('2025-10-17');
      const currentDate = new Date(startDate);
      
      // 为每个基金生成历史数据
      for (const fundId in this.funds) {
        const fundConfig = this.funds[fundId];
        let currentNav = fundConfig.nav;
        
        // 清空现有历史数据
        this.navHistory[fundId] = [];
        
        // 重置当前日期
        currentDate.setTime(startDate.getTime());
        
        // 从开始日期到结束日期逐日生成数据
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // 模拟政策红利影响下的偏暖行情
          // 在8月1日到9月1日期间，增加上涨概率
          const isPolicyBoostPeriod = currentDate < new Date('2025-09-01');
          
          // 根据风险等级确定波动率
          let volatility;
          if (fundConfig.risk_level === "低") {
            volatility = 0.005;  // 0.5%
          } else if (fundConfig.risk_level === "中等") {
            volatility = 0.015;  // 1.5%
          } else {  // 高
            volatility = 0.03;  // 3.0%
          }
          
          // 生成净值变动
          let navChange = this._getRandomNormal(0, volatility);
          
          // 在政策红利期间增加上涨概率
          if (isPolicyBoostPeriod) {
            navChange += 0.001; // 每日增加0.1%的上涨倾向
          }
          
          // 周末波动性降低
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            navChange *= 0.7;
          }
          
          currentNav = currentNav * (1 + navChange);
          
          // 记录净值历史
          this.navHistory[fundId].push({
            "date": dateStr,
            "nav": Math.round(currentNav * 10000) / 10000,
            "change": Math.round(navChange * 10000) / 100
          });
          
          // 移动到下一天
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // 设置当前净值为最后一天的净值
        this.funds[fundId].nav = Math.round(currentNav * 10000) / 10000;
      }
    } catch (error) {
      console.error('生成历史数据失败:', error);
    }
  }
  
  _getRandomNormal(mean, stdDev) {
    try {
      /** 生成正态分布随机数 */
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      num = num * stdDev + mean;
      return num;
    } catch (error) {
      console.error('生成正态分布随机数失败:', error);
      return mean; // 返回均值作为默认值
    }
  }
  
  updateFundNav() {
    try {
      /** 更新基金净值 */
      for (const fundId in this.funds) {
        const fundConfig = this.funds[fundId];
        const currentNav = fundConfig.nav;
        const riskLevel = fundConfig.risk_level;
        
        // 根据风险等级确定波动率
        let volatility;
        if (riskLevel === "低") {
          volatility = 0.005;  // 0.5%
        } else if (riskLevel === "中等") {
          volatility = 0.015;  // 1.5%
        } else {  // 高
          volatility = 0.03;  // 3.0%
        }
        
        // 生成净值变动
        const navChange = this._getRandomNormal(0, volatility);
        const newNav = currentNav * (1 + navChange);
        
        // 更新净值
        this.funds[fundId].nav = Math.round(newNav * 10000) / 10000;
        
        // 记录净值历史
        this.navHistory[fundId].push({
          "date": new Date().toISOString().split('T')[0],
          "nav": this.funds[fundId].nav,
          "change": Math.round(navChange * 10000) / 100
        });
        
        // 只保留最近100条记录
        if (this.navHistory[fundId].length > 100) {
          this.navHistory[fundId] = this.navHistory[fundId].slice(-100);
        }
      }
    } catch (error) {
      console.error('更新基金净值失败:', error);
    }
  }
  
  getFundInfo(fundId) {
    try {
      /** 获取基金信息 */
      if (!this.funds[fundId]) {
        throw new Error(`基金 ${fundId} 不存在`);
      }
      
      const fund = this.funds[fundId];
      const navHistory = this.navHistory[fundId] || [];
      const latestNavRecord = navHistory.length > 0 ? navHistory[navHistory.length - 1] : null;
      
      return {
        "fund_id": fundId,
        "name": fund.name,
        "fund_manager": fund.fund_manager,
        "risk_level": fund.risk_level,
        "min_investment": fund.min_investment,
        "management_fee": fund.management_fee,
        "performance_fee": fund.performance_fee,
        "current_nav": fund.nav,
        "nav_change": latestNavRecord ? latestNavRecord.change : 0,
        "nav_date": latestNavRecord ? latestNavRecord.date : null
      };
    } catch (error) {
      console.error('获取基金信息失败:', error);
      throw error;
    }
  }
  
  getAllFunds() {
    try {
      /** 获取所有基金 */
      const funds = [];
      for (const fundId in this.funds) {
        funds.push(this.getFundInfo(fundId));
      }
      return funds;
    } catch (error) {
      console.error('获取所有基金失败:', error);
      throw error;
    }
  }
  
  subscribeFund(userId, fundId, amount) {
    try {
      /** 认购基金 */
      if (!this.funds[fundId]) {
        throw new Error(`基金 ${fundId} 不存在`);
      }
      
      const fundConfig = this.funds[fundId];
      
      // 检查最低投资额
      if (amount < fundConfig.min_investment) {
        throw new Error(`投资金额低于最低要求${fundConfig.min_investment}`);
      }
      
      const currentNav = fundConfig.nav;
      const shares = amount / currentNav;
      
      // 创建交易记录
      const transactionId = generateId();
      const transaction = {
        "transaction_id": transactionId,
        "user_id": userId,
        "fund_id": fundId,
        "type": "subscribe",
        "amount": amount,
        "nav": currentNav,
        "shares": shares,
        "fee": amount * fundConfig.management_fee,
        "transaction_time": new Date()
      };
      
      this.transactions.push(transaction);
      
      // 更新用户持仓
      this._updateUserPosition(userId, fundId, shares, currentNav);
      
      return {
        "success": true,
        "transaction_id": transactionId,
        "message": `成功认购 ${fundConfig.name}`,
        "amount": amount,
        "shares": Math.round(shares * 10000) / 10000,
        "nav": currentNav,
        "fee": amount * fundConfig.management_fee
      };
    } catch (error) {
      console.error('认购基金失败:', error);
      return {"success": false, "error": error.message};
    }
  }
  
  redeemFund(userId, fundId, shares) {
    try {
      /** 赎回基金 */
      if (!this.funds[fundId]) {
        throw new Error(`基金 ${fundId} 不存在`);
      }
      
      // 检查用户持仓
      const positionKey = `${userId}_${fundId}`;
      if (!this.userPositions[positionKey]) {
        throw new Error("没有该基金的持仓");
      }
      
      const position = this.userPositions[positionKey];
      
      if (shares > position.shares) {
        throw new Error("赎回份额超过持仓");
      }
      
      const fundConfig = this.funds[fundId];
      const currentNav = fundConfig.nav;
      const redeemAmount = shares * currentNav;
      
      // 计算业绩报酬（如果有盈利）
      let performanceFee = 0;
      const avgCost = position.total_cost / position.shares;
      if (currentNav > avgCost) {
        const profit = (currentNav - avgCost) * shares;
        performanceFee = profit * fundConfig.performance_fee;
      }
      
      const totalFee = redeemAmount * fundConfig.management_fee + performanceFee;
      const netAmount = redeemAmount - totalFee;
      
      // 创建交易记录
      const transactionId = generateId();
      const transaction = {
        "transaction_id": transactionId,
        "user_id": userId,
        "fund_id": fundId,
        "type": "redeem",
        "shares": shares,
        "nav": currentNav,
        "amount": redeemAmount,
        "fee": totalFee,
        "net_amount": netAmount,
        "performance_fee": performanceFee,
        "transaction_time": new Date()
      };
      
      this.transactions.push(transaction);
      
      // 更新用户持仓
      this._updateUserPosition(userId, fundId, -shares, currentNav);
      
      return {
        "success": true,
        "transaction_id": transactionId,
        "message": `成功赎回 ${fundConfig.name}`,
        "shares": shares,
        "amount": redeemAmount,
        "net_amount": netAmount,
        "fee": totalFee
      };
    } catch (error) {
      console.error('赎回基金失败:', error);
      return {"success": false, "error": error.message};
    }
  }
  
  _updateUserPosition(userId, fundId, shares, nav) {
    try {
      /** 更新用户持仓 */
      const positionKey = `${userId}_${fundId}`;
      
      if (!this.userPositions[positionKey]) {
        this.userPositions[positionKey] = {
          "user_id": userId,
          "fund_id": fundId,
          "shares": 0,
          "total_cost": 0,
          "avg_cost": 0
        };
      }
      
      const position = this.userPositions[positionKey];
      
      if (shares > 0) {  // 申购
        const cost = shares * nav;
        position.shares += shares;
        position.total_cost += cost;
        position.avg_cost = position.total_cost / position.shares;
      } else {  // 赎回
        position.shares += shares;  // shares为负值
        if (position.shares <= 0) {
          delete this.userPositions[positionKey];
        }
      }
    } catch (error) {
      console.error('更新用户持仓失败:', error);
    }
  }
  
  getUserPositions(userId) {
    try {
      /** 获取用户基金持仓 */
      const userPositions = [];
      
      for (const positionKey in this.userPositions) {
        const position = this.userPositions[positionKey];
        if (position.user_id === userId) {
          const fundId = position.fund_id;
          const fundConfig = this.funds[fundId];
          const currentNav = fundConfig.nav;
          
          // 计算持仓价值
          const marketValue = position.shares * currentNav;
          const totalCost = position.total_cost;
          const floatingProfit = marketValue - totalCost;
          const profitPercent = totalCost > 0 ? (floatingProfit / totalCost) * 100 : 0;
          
          const positionData = {
            ...position,
            "fund_name": fundConfig.name,
            "current_nav": currentNav,
            "market_value": marketValue,
            "floating_profit": floatingProfit,
            "profit_percent": profitPercent
          };
          userPositions.push(positionData);
        }
      }
      
      return userPositions;
    } catch (error) {
      console.error('获取用户基金持仓失败:', error);
      throw error;
    }
  }
  
  getTransactionHistory(userId, limit = 50) {
    try {
      /** 获取用户交易记录 */
      const userTransactions = this.transactions.filter(t => t.user_id === userId);
      return userTransactions.sort((a, b) => b.transaction_time - a.transaction_time).slice(0, limit);
    } catch (error) {
      console.error('获取用户交易记录失败:', error);
      throw error;
    }
  }
  
  getNavHistory(fundId, startDate, endDate) {
    try {
      /** 获取基金净值历史 */
      if (!this.navHistory[fundId]) {
        return [];
      }
      
      // 如果没有指定日期范围，返回所有历史数据
      if (!startDate && !endDate) {
        return this.navHistory[fundId];
      }
      
      // 过滤指定日期范围内的数据
      const start = startDate ? new Date(startDate) : new Date('2025-08-01');
      const end = endDate ? new Date(endDate) : new Date('2025-10-17');
      
      const history = this.navHistory[fundId].filter(data => {
        const dataDate = new Date(data.date);
        return dataDate >= start && dataDate <= end;
      });
      
      return history;
    } catch (error) {
      console.error('获取基金净值历史失败:', error);
      throw error;
    }
  }
  
  calculateFundPerformance(fundId) {
    try {
      /** 计算基金表现 */
      if (!this.navHistory[fundId]) {
        throw new Error(`基金 ${fundId} 不存在`);
      }
      
      const navHistory = this.navHistory[fundId];
      if (navHistory.length < 2) {
        return {
          "daily_return": 0,
          "weekly_return": 0,
          "monthly_return": 0,
          "total_return": 0
        };
      }
      
      const currentNav = navHistory[navHistory.length - 1].nav;
      
      // 日回报
      const dailyNav = navHistory.length >= 2 ? navHistory[navHistory.length - 2].nav : currentNav;
      const dailyReturn = ((currentNav - dailyNav) / dailyNav) * 100;
      
      // 周回报（最近7天）
      const weeklyNav = navHistory.length >= 7 ? navHistory[navHistory.length - 7].nav : navHistory[0].nav;
      const weeklyReturn = ((currentNav - weeklyNav) / weeklyNav) * 100;
      
      // 月回报（最近30天）
      const monthlyNav = navHistory.length >= 30 ? navHistory[navHistory.length - 30].nav : navHistory[0].nav;
      const monthlyReturn = ((currentNav - monthlyNav) / monthlyNav) * 100;
      
      // 总回报
      const initialNav = navHistory[0].nav;
      const totalReturn = ((currentNav - initialNav) / initialNav) * 100;
      
      return {
        "daily_return": Math.round(dailyReturn * 100) / 100,
        "weekly_return": Math.round(weeklyReturn * 100) / 100,
        "monthly_return": Math.round(monthlyReturn * 100) / 100,
        "total_return": Math.round(totalReturn * 100) / 100,
        "current_nav": currentNav,
        "initial_nav": initialNav
      };
    } catch (error) {
      console.error('计算基金表现失败:', error);
      throw error;
    }
  }
}

module.exports = PrivateFundEngine;