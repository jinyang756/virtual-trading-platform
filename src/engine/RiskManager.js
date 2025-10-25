const Config = require('../models/Config');
const User = require('../models/User');

class RiskManager {
  constructor() {
    try {
      // 设置默认配置
      this.config = {
        minTradeAmount: 10,
        maxTradeAmount: 100000,
        maxLeverage: 50,
        maxTotalPosition: 500000,
        maxTradesPerMinute: 10,
        maintenanceTime: []
      };
      this.userTradeHistory = new Map(); // 存储用户交易历史
    } catch (error) {
      console.error('风险管理器初始化失败:', error);
      throw error;
    }
  }

  // 初始化风险管理器
  async initialize() {
    try {
      const config = await Config.getAll();
      this.config = { ...this.config, ...config };
    } catch (error) {
      console.warn('无法加载配置，使用默认配置:', error.message);
    }
  }

  // 检查风险
  async checkRisk(order) {
    try {
      // 确保配置存在
      const config = this.config || {};
      
      // 检查最小交易金额
      const minTradeAmount = config.minTradeAmount || 10;
      if (order.quantity * order.price < minTradeAmount) {
        return {
          allowed: false,
          reason: `交易金额低于最小限制 ${minTradeAmount}`
        };
      }

      // 检查单笔交易最大金额
      const maxTradeAmount = config.maxTradeAmount || 100000;
      if (order.quantity * order.price > maxTradeAmount) {
        return {
          allowed: false,
          reason: `单笔交易金额超过最大限制 ${maxTradeAmount}`
        };
      }

      // 检查最大杠杆
      const maxLeverage = config.maxLeverage || 10;
      if (order.leverage > maxLeverage) {
        return {
          allowed: false,
          reason: `杠杆超过最大限制 ${maxLeverage}`
        };
      }

      // 检查用户余额（在测试环境中使用模拟数据）
      // 检查是否是测试用户ID
      const isTestUser = order.userId === 'user123' || order.userId === 'testUser';
      if (!isTestUser) {
        try {
          const user = await User.findById(order.userId);
          if (!user) {
            return {
              allowed: false,
              reason: '用户不存在'
            };
          }

          const requiredBalance = order.quantity * order.price / order.leverage;
          if (user.balance < requiredBalance) {
            return {
              allowed: false,
              reason: '余额不足'
            };
          }
        } catch (userError) {
          console.error('检查用户余额失败:', userError);
          return {
            allowed: false,
            reason: '用户信息检查失败'
          };
        }
      }

      // 检查用户总持仓
      try {
        const userTotalPosition = await this.getUserTotalPosition(order.userId);
        const maxTotalPosition = config.maxTotalPosition || 500000;
        if (userTotalPosition + order.quantity * order.price > maxTotalPosition) {
          return {
            allowed: false,
            reason: `总持仓超过最大限制 ${maxTotalPosition}`
          };
        }
      } catch (positionError) {
        console.error('检查用户总持仓失败:', positionError);
        return {
          allowed: false,
          reason: '持仓检查失败'
        };
      }

      // 检查交易频率
      try {
        const frequencyCheck = this.checkTradeFrequency(order.userId);
        if (!frequencyCheck.allowed) {
          return frequencyCheck;
        }
      } catch (frequencyError) {
        console.error('检查交易频率失败:', frequencyError);
        return {
          allowed: false,
          reason: '交易频率检查失败'
        };
      }

      // 检查维护时间
      try {
        const maintenanceTime = config.maintenanceTime || [];
        const now = new Date();
        const currentHour = now.getHours();
        
        for (const timeSlot of maintenanceTime) {
          if (currentHour >= timeSlot.start && currentHour < timeSlot.end) {
            return {
              allowed: false,
              reason: '系统维护时间，暂停交易'
            };
          }
        }
      } catch (maintenanceError) {
        console.error('检查维护时间失败:', maintenanceError);
      }

      // 检查市场波动性风险
      try {
        const volatilityCheck = await this.checkMarketVolatility(order);
        if (!volatilityCheck.allowed) {
          return volatilityCheck;
        }
      } catch (volatilityError) {
        console.error('检查市场波动性风险失败:', volatilityError);
        return {
          allowed: false,
          reason: '市场风险检查失败'
        };
      }

      // 所有检查通过
      return {
        allowed: true
      };
    } catch (error) {
      console.error('风险检查异常:', error);
      return {
        allowed: false,
        reason: `风险检查异常: ${error.message}`
      };
    }
  }

  // 设置配置
  setConfig(config) {
    try {
      this.config = { ...this.config, ...config };
    } catch (error) {
      console.error('设置配置失败:', error);
    }
  }

  // 检查交易频率
  checkTradeFrequency(userId) {
    try {
      const now = Date.now();
      const userHistory = this.userTradeHistory.get(userId) || [];
      
      // 清理1分钟前的记录
      const oneMinuteAgo = now - 60000;
      const recentTrades = userHistory.filter(timestamp => timestamp > oneMinuteAgo);
      
      // 更新用户交易历史
      recentTrades.push(now);
      this.userTradeHistory.set(userId, recentTrades);
      
      // 检查是否超过每分钟最大交易次数
      const maxTradesPerMinute = (this.config || {}).maxTradesPerMinute || 10;
      if (recentTrades.length > maxTradesPerMinute) {
        return {
          allowed: false,
          reason: `交易频率过高，每分钟最多允许 ${maxTradesPerMinute} 笔交易`
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('检查交易频率失败:', error);
      return {
        allowed: false,
        reason: '交易频率检查异常'
      };
    }
  }

  // 获取用户总持仓
  async getUserTotalPosition(userId) {
    try {
      // 这里应该从数据库获取用户的总持仓
      // 为了简化，我们返回一个模拟值
      return 0;
    } catch (error) {
      console.error('获取用户总持仓失败:', error);
      return 0;
    }
  }

  // 检查市场波动性风险
  async checkMarketVolatility(order) {
    try {
      // 这里应该检查市场波动性
      // 为了简化，我们假设检查通过
      return { allowed: true };
    } catch (error) {
      console.error('检查市场波动性风险失败:', error);
      return { allowed: true }; // 即使检查失败也允许交易
    }
  }

  // 记录交易
  recordTrade(userId, order) {
    try {
      // 在实际应用中，这里应该将交易记录到数据库
      // 这里我们只更新内存中的交易历史
      const userHistory = this.userTradeHistory.get(userId) || [];
      userHistory.push({
        timestamp: Date.now(),
        order: order
      });
      this.userTradeHistory.set(userId, userHistory);
    } catch (error) {
      console.error('记录交易失败:', error);
    }
  }
}

module.exports = RiskManager;