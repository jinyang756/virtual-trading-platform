const ContractTradingEngine = require('./ContractEngine');
const BinaryOptionEngine = require('./BinaryOptionEngine');
const PrivateFundEngine = require('./PrivateFundEngine');

class VirtualTradingEngine {
  constructor() {
    try {
      // 初始化三个交易引擎
      this.contractEngine = new ContractTradingEngine();
      this.binaryEngine = new BinaryOptionEngine();
      this.fundEngine = new PrivateFundEngine();
      
      // 启动市场数据更新
      this._startMarketUpdates();
    } catch (error) {
      console.error('虚拟交易引擎初始化失败:', error);
      throw error;
    }
  }

  // 启动市场数据更新
  _startMarketUpdates() {
    try {
      // 每30秒更新一次市场数据
      this.marketUpdateInterval = setInterval(() => {
        try {
          if (this.contractEngine && typeof this.contractEngine.updateMarketData === 'function') {
            this.contractEngine.updateMarketData();
          }
          if (this.fundEngine && typeof this.fundEngine.updateFundNav === 'function') {
            this.fundEngine.updateFundNav();
          }
          
          // 更新二元期权的基础价格
          if (this.contractEngine && this.binaryEngine) {
            const shPrice = this.contractEngine.currentPrices["SH_FUTURE"] || 1000;
            if (typeof this.binaryEngine.updateBasePrice === 'function') {
              this.binaryEngine.updateBasePrice(shPrice);
            }
          }
        } catch (updateError) {
          console.error('市场数据更新失败:', updateError);
        }
      }, 30000);
    } catch (error) {
      console.error('启动市场数据更新失败:', error);
    }
  }

  // 清理资源
  cleanup() {
    try {
      if (this.marketUpdateInterval) {
        clearInterval(this.marketUpdateInterval);
        this.marketUpdateInterval = null;
      }
      
      // 清理二元期权引擎的定时器
      if (this.binaryEngine && typeof this.binaryEngine.cleanup === 'function') {
        this.binaryEngine.cleanup();
      }
    } catch (error) {
      console.error('清理资源失败:', error);
    }
  }

  // 合约交易相关方法
  getContractMarketData(symbolId) {
    return this.contractEngine.getMarketData(symbolId);
  }

  getAllContractMarketData() {
    return this.contractEngine.getAllMarketData();
  }

  placeContractOrder(userId, symbolId, direction, amount, leverage) {
    return this.contractEngine.placeOrder(userId, symbolId, direction, amount, leverage);
  }

  getContractUserPositions(userId) {
    return this.contractEngine.getUserPositions(userId);
  }

  getContractOrderHistory(userId, limit) {
    return this.contractEngine.getOrderHistory(userId, limit);
  }

  getContractPriceHistory(symbolId, startDate, endDate) {
    return this.contractEngine.getPriceHistory(symbolId, startDate, endDate);
  }

  calculateContractPortfolioValue(userId) {
    return this.contractEngine.calculatePortfolioValue(userId);
  }

  // 二元期权相关方法
  getBinaryStrategies() {
    return this.binaryEngine.getStrategies();
  }

  getCurrentTrend() {
    return this.binaryEngine.getCurrentTrend();
  }

  placeBinaryOrder(userId, strategyId, direction, investment) {
    return this.binaryEngine.placeBinaryOrder(userId, strategyId, direction, investment);
  }

  getBinaryActiveOrders(userId) {
    return this.binaryEngine.getActiveOrders(userId);
  }

  getBinaryOrderHistory(userId, limit) {
    return this.binaryEngine.getOrderHistory(userId, limit);
  }

  getBinaryStatistics(userId) {
    return this.binaryEngine.getBinaryStatistics(userId);
  }

  getBinaryHistoricalStatistics(startDate, endDate) {
    return this.binaryEngine.getHistoricalStatistics(startDate, endDate);
  }

  // 私募基金相关方法
  getFundInfo(fundId) {
    return this.fundEngine.getFundInfo(fundId);
  }

  getAllFunds() {
    return this.fundEngine.getAllFunds();
  }

  subscribeFund(userId, fundId, amount) {
    return this.fundEngine.subscribeFund(userId, fundId, amount);
  }

  redeemFund(userId, fundId, shares) {
    return this.fundEngine.redeemFund(userId, fundId, shares);
  }

  getFundUserPositions(userId) {
    return this.fundEngine.getUserPositions(userId);
  }

  getFundTransactionHistory(userId, limit) {
    return this.fundEngine.getTransactionHistory(userId, limit);
  }

  getFundNavHistory(fundId, startDate, endDate) {
    return this.fundEngine.getNavHistory(fundId, startDate, endDate);
  }

  calculateFundPerformance(fundId) {
    return this.fundEngine.calculateFundPerformance(fundId);
  }

  // 获取所有市场数据
  getAllMarketData() {
    return {
      contracts: this.contractEngine.getAllMarketData(),
      funds: this.fundEngine.getAllFunds()
    };
  }
  
  // 获取用户综合投资组合
  getUserPortfolio(userId) {
    return {
      contracts: this.contractEngine.calculatePortfolioValue(userId),
      funds: this.fundEngine.getUserPositions(userId),
      binary: this.binaryEngine.getBinaryStatistics(userId)
    };
  }
  
  // 获取用户所有持仓
  getUserAllPositions(userId) {
    return {
      contracts: this.contractEngine.getUserPositions(userId),
      funds: this.fundEngine.getUserPositions(userId)
    };
  }
  
  // 获取用户所有订单历史
  getUserAllOrderHistory(userId, limit = 50) {
    return {
      contracts: this.contractEngine.getOrderHistory(userId, limit),
      binary: this.binaryEngine.getOrderHistory(userId, limit)
    };
  }
}

module.exports = VirtualTradingEngine;