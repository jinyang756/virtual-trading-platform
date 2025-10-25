const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const { generateId } = require('../utils/codeGenerator');
const ContractOrder = require('../models/ContractOrder');
const Position = require('../models/Position');
const logger = require('../utils/logger');
const { BusinessError, ValidationError } = require('../middleware/enhancedErrorHandler');
const RiskManager = require('./RiskManager');

class ContractTradingEngine {
  /**
   * 合约交易引擎
   * 支持多品种合约交易，带杠杆和保证金管理
   */
  constructor() {
    try {
      this.symbols = {
        "SH_FUTURE": {
          "name": "聚财基金上海合约",
          "base_price": 1000,
          "leverage": 50,
          "margin_rate": 0.02,
          "volatility": 0.15
        },
        "HK_FUTURE": {
          "name": "聚财基金香港合约", 
          "base_price": 800,
          "leverage": 100,
          "margin_rate": 0.01,
          "volatility": 0.20
        },
        "NY_FUTURE": {
          "name": "聚财基金纽约合约",
          "base_price": 1200,
          "leverage": 75,
          "margin_rate": 0.015,
          "volatility": 0.18
        },
        "OIL_FUTURE": {
          "name": "原油期货合约",
          "base_price": 85,
          "leverage": 20,
          "margin_rate": 0.05,
          "volatility": 0.25
        },
        "GOLD_FUTURE": {
          "name": "黄金期货合约",
          "base_price": 1950,
          "leverage": 10,
          "margin_rate": 0.03,
          "volatility": 0.12
        }
      };
      
      // 虚拟价格数据
      this.currentPrices = {};
      this.priceHistory = {};
      
      // 订单和持仓数据
      this.orders = [];
      this.positions = {};
      
      // 风控管理器
      this.riskManager = new RiskManager();
      // 设置默认配置
      this.riskManager.setConfig({
        minTradeAmount: 10,
        maxTradeAmount: 100000,
        maxLeverage: 50,
        maxTotalPosition: 500000,
        maxTradesPerMinute: 10,
        maintenanceTime: []
      });
      
      // 初始化价格
      this._initializePrices();
      
      // 生成历史数据
      this._generateHistoricalData();
      
      logger.info('合约交易引擎初始化完成');
    } catch (error) {
      logger.error('合约交易引擎初始化失败:', error);
      throw error;
    }
  }
  
  _initializePrices() {
    try {
      /** 初始化价格数据 */
      for (const symbolId in this.symbols) {
        this.currentPrices[symbolId] = this.symbols[symbolId].base_price;
        this.priceHistory[symbolId] = [];
      }
      
      logger.info('合约价格数据初始化完成');
    } catch (error) {
      logger.error('合约价格数据初始化失败:', error);
    }
  }
  
  _generateHistoricalData() {
    try {
      /** 生成历史数据 */
      const startDate = new Date('2025-08-01');
      const endDate = new Date('2025-10-17');
      const currentDate = new Date(startDate);
      
      // 为每个交易品种生成历史数据
      for (const symbolId in this.symbols) {
        const config = this.symbols[symbolId];
        let currentPrice = config.base_price;
        
        // 清空现有历史数据
        this.priceHistory[symbolId] = [];
        
        // 从开始日期到结束日期逐日生成数据
        while (currentDate <= endDate) {
          // 模拟政策红利影响下的偏暖行情
          // 在8月1日到9月1日期间，增加上涨概率
          const isPolicyBoostPeriod = currentDate < new Date('2025-09-01');
          
          // 生成价格变动
          let randomChange = this._getRandomNormal(0, config.volatility * 0.1);
          
          // 在政策红利期间增加上涨概率
          if (isPolicyBoostPeriod) {
            randomChange += 0.002; // 每日增加0.2%的上涨倾向
          }
          
          // 周末波动性降低
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            randomChange *= 0.7;
          }
          
          const priceChange = randomChange * currentPrice;
          currentPrice = currentPrice + priceChange;
          
          // 防止价格过低
          currentPrice = Math.max(currentPrice, config.base_price * 0.5);
          
          // 记录历史数据
          this.priceHistory[symbolId].push({
            "timestamp": new Date(currentDate),
            "price": Math.round(currentPrice * 100) / 100
          });
          
          // 移动到下一天
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // 重置日期为开始日期，为下一个品种生成数据
        currentDate.setTime(startDate.getTime());
        
        // 设置当前价格为最后一天的价格
        this.currentPrices[symbolId] = Math.round(currentPrice * 100) / 100;
      }
      
      logger.info('合约历史数据生成完成');
    } catch (error) {
      logger.error('合约历史数据生成失败:', error);
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
      logger.error('生成正态分布随机数失败:', error);
      return mean; // 返回均值作为默认值
    }
  }
  
  updateMarketData() {
    try {
      /** 更新市场数据 */
      for (const symbolId in this.symbols) {
        const config = this.symbols[symbolId];
        const currentPrice = this.currentPrices[symbolId];
        const volatility = config.volatility;
        
        // 生成价格变动
        const randomChange = this._getRandomNormal(0, volatility * 0.1);
        const priceChange = randomChange * currentPrice;
        
        let newPrice = currentPrice + priceChange;
        // 防止价格过低
        newPrice = Math.max(newPrice, config.base_price * 0.5);
        
        this.currentPrices[symbolId] = Math.round(newPrice * 100) / 100;
        this.priceHistory[symbolId].push({
          "timestamp": new Date(),
          "price": newPrice
        });
        
        // 只保留最近100条记录
        if (this.priceHistory[symbolId].length > 100) {
          this.priceHistory[symbolId] = this.priceHistory[symbolId].slice(-100);
        }
      }
      
      logger.debug('合约市场数据更新完成');
    } catch (error) {
      logger.error('合约市场数据更新失败:', error);
    }
  }
  
  getMarketData(symbolId) {
    try {
      /** 获取市场数据 */
      if (!this.symbols[symbolId]) {
        logger.warn('尝试获取不存在的合约品种', { symbolId });
        throw new BusinessError(`交易品种 ${symbolId} 不存在`);
      }
      
      const currentPrice = this.currentPrices[symbolId];
      const basePrice = this.symbols[symbolId].base_price;
      const changePercent = ((currentPrice - basePrice) / basePrice * 100);
      
      logger.debug('获取合约市场数据', { symbolId, currentPrice });
      
      return {
        "symbol": symbolId,
        "name": this.symbols[symbolId].name,
        "price": currentPrice,
        "change": Math.round(changePercent * 100) / 100,
        "leverage": this.symbols[symbolId].leverage,
        "timestamp": new Date()
      };
    } catch (error) {
      logger.error('获取合约市场数据失败:', error);
      throw error;
    }
  }
  
  getAllMarketData() {
    /** 获取所有品种市场数据 */
    const marketData = [];
    for (const symbolId in this.symbols) {
      try {
        const data = this.getMarketData(symbolId);
        marketData.push(data);
      } catch (error) {
        logger.error('获取合约市场数据失败', { symbolId, error: error.message });
      }
    }
    
    logger.debug('获取所有合约市场数据完成', { count: marketData.length });
    return marketData;
  }
  
  async placeOrder(userId, symbolId, direction, amount, leverage = 1) {
    /** 下订单 */
    try {
      if (!userId) {
        throw new ValidationError('用户ID不能为空', 'userId');
      }
      
      if (!this.symbols[symbolId]) {
        throw new BusinessError(`交易品种 ${symbolId} 不存在`);
      }
      
      if (direction !== "buy" && direction !== "sell") {
        throw new ValidationError('交易方向错误，必须是buy或sell', 'direction');
      }
      
      if (amount <= 0) {
        throw new ValidationError('交易数量必须大于0', 'amount');
      }
      
      if (leverage <= 0) {
        throw new ValidationError('杠杆倍数必须大于0', 'leverage');
      }
      
      const symbolConfig = this.symbols[symbolId];
      
      // 检查杠杆是否超过限制
      if (leverage > symbolConfig.leverage) {
        throw new BusinessError(`杠杆超过最大限制${symbolConfig.leverage}倍`);
      }
      
      const currentPrice = this.currentPrices[symbolId];
      const contractValue = amount * currentPrice;
      const marginRequired = contractValue / leverage * symbolConfig.margin_rate;
      
      // 风控检查
      const riskCheck = await this.riskManager.checkRisk({
        userId: userId,
        symbol: symbolId,
        direction: direction,
        quantity: amount,
        price: currentPrice,
        leverage: leverage
      });
      
      if (!riskCheck.allowed) {
        throw new BusinessError(`风控检查未通过: ${riskCheck.reason}`);
      }
      
      // 创建订单
      const order = {
        "order_id": generateId(),
        "user_id": userId,
        "symbol": symbolId,
        "direction": direction,
        "amount": amount,
        "price": currentPrice,
        "leverage": leverage,
        "margin": marginRequired,
        "order_time": new Date(),
        "status": "filled"
      };
      
      this.orders.push(order);
      
      // 更新持仓
      this._updatePosition(userId, symbolId, direction, amount, currentPrice);
      
      // 记录交易
      this.riskManager.recordTrade(userId, order);
      
      logger.info('合约订单创建成功', {
        orderId: order.order_id,
        userId,
        symbolId,
        direction,
        amount,
        price: currentPrice
      });
      
      return {
        "success": true,
        "order_id": order.order_id,
        "message": `${direction} ${symbolConfig.name} ${amount}手成功`,
        "margin_used": marginRequired,
        "current_price": currentPrice
      };
    } catch (error) {
      logger.error('合约订单创建失败', {
        userId,
        symbolId,
        direction,
        amount,
        leverage,
        error: error.message
      });
      
      throw error;
    }
  }
  
  _updatePosition(userId, symbolId, direction, amount, price) {
    /** 更新持仓 */
    const positionKey = `${userId}_${symbolId}_${direction}`;
    
    if (!this.positions[positionKey]) {
      this.positions[positionKey] = {
        "user_id": userId,
        "symbol": symbolId,
        "direction": direction,
        "total_amount": 0,
        "avg_price": 0,
        "total_value": 0
      };
    }
    
    const position = this.positions[positionKey];
    
    // 计算新的平均价格
    const oldValue = position.total_amount * position.avg_price;
    const newValue = amount * price;
    const totalAmount = position.total_amount + amount;
    
    if (totalAmount > 0) {
      position.avg_price = (oldValue + newValue) / totalAmount;
      position.total_amount = totalAmount;
      position.total_value = totalAmount * price;
    } else {
      // 如果持仓为0，删除该持仓记录
      delete this.positions[positionKey];
    }
    
    logger.debug('合约持仓更新完成', { positionKey, totalAmount });
  }
  
  getUserPositions(userId) {
    /** 获取用户持仓 */
    if (!userId) {
      throw new ValidationError('用户ID不能为空', 'userId');
    }
    
    const userPositions = [];
    
    for (const positionKey in this.positions) {
      const position = this.positions[positionKey];
      if (position.user_id === userId) {
        const symbolId = position.symbol;
        const currentPrice = this.currentPrices[symbolId];
        
        // 计算浮动盈亏
        let floatingProfit = 0;
        if (position.direction === "buy") {
          floatingProfit = (currentPrice - position.avg_price) * position.total_amount;
        } else { // sell
          floatingProfit = (position.avg_price - currentPrice) * position.total_amount;
        }
        
        const positionData = {
          ...position,
          "current_price": currentPrice,
          "floating_profit": Math.round(floatingProfit * 100) / 100,
          "profit_percent": Math.round((floatingProfit / (position.avg_price * position.total_amount)) * 10000) / 100
        };
        userPositions.push(positionData);
      }
    }
    
    logger.debug('获取用户合约持仓完成', { userId, count: userPositions.length });
    return userPositions;
  }
  
  getOrderHistory(userId, limit = 50) {
    /** 获取订单历史 */
    if (!userId) {
      throw new ValidationError('用户ID不能为空', 'userId');
    }
    
    const userOrders = this.orders.filter(order => order.user_id === userId);
    const sortedOrders = userOrders.sort((a, b) => b.order_time - a.order_time).slice(0, limit);
    
    logger.debug('获取合约订单历史完成', { userId, count: sortedOrders.length });
    return sortedOrders;
  }
  
  getPriceHistory(symbolId, startDate, endDate) {
    /** 获取价格历史 */
    if (!this.priceHistory[symbolId]) {
      logger.warn('尝试获取不存在合约品种的价格历史', { symbolId });
      return [];
    }
    
    // 如果没有指定日期范围，返回所有历史数据
    if (!startDate && !endDate) {
      logger.debug('获取合约价格历史完成', { symbolId, count: this.priceHistory[symbolId].length });
      return this.priceHistory[symbolId];
    }
    
    // 过滤指定日期范围内的数据
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    const history = this.priceHistory[symbolId].filter(data => {
      const dataTime = new Date(data.timestamp);
      return dataTime >= start && dataTime <= end;
    });
    
    logger.debug('获取合约价格历史完成', { symbolId, count: history.length });
    return history;
  }
  
  calculatePortfolioValue(userId) {
    /** 计算投资组合价值 */
    if (!userId) {
      throw new ValidationError('用户ID不能为空', 'userId');
    }
    
    const positions = this.getUserPositions(userId);
    let totalValue = 0;
    let totalProfit = 0;
    
    for (const position of positions) {
      totalValue += position.total_amount * position.current_price;
      totalProfit += position.floating_profit;
    }
    
    const portfolioValue = {
      "total_value": Math.round(totalValue * 100) / 100,
      "total_profit": Math.round(totalProfit * 100) / 100,
      "position_count": positions.length
    };
    
    logger.debug('计算投资组合价值完成', { userId, ...portfolioValue });
    return portfolioValue;
  }
}

module.exports = ContractTradingEngine;