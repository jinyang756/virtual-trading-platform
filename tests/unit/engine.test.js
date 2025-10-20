const ContractTradingEngine = require('../../src/engine/ContractEngine');
const BinaryOptionEngine = require('../../src/engine/BinaryOptionEngine');
const PrivateFundEngine = require('../../src/engine/PrivateFundEngine');

describe('交易引擎测试', () => {
  describe('合约交易引擎', () => {
    let contractEngine;

    beforeEach(() => {
      contractEngine = new ContractTradingEngine();
    });

    test('创建合约交易引擎实例', () => {
      expect(contractEngine).toBeDefined();
      expect(contractEngine.symbols).toBeDefined();
      expect(Object.keys(contractEngine.symbols)).toHaveLength(5);
    });

    test('获取市场数据', () => {
      const marketData = contractEngine.getMarketData('SH_FUTURE');
      expect(marketData).toBeDefined();
      expect(marketData.symbol).toBe('SH_FUTURE');
      expect(marketData.price).toBeGreaterThan(0);
    });

    test('获取所有市场数据', () => {
      const allMarketData = contractEngine.getAllMarketData();
      expect(Array.isArray(allMarketData)).toBe(true);
      expect(allMarketData).toHaveLength(5);
    });

    test('下合约订单', async () => {
      const result = await contractEngine.placeOrder('user123', 'SH_FUTURE', 'buy', 10, 10);
      expect(result.success).toBe(true);
      expect(result.order_id).toBeDefined();
      expect(result.margin_used).toBeGreaterThan(0);
    });

    test('获取用户持仓', async () => {
      // 先下单
      await contractEngine.placeOrder('user123', 'SH_FUTURE', 'buy', 10, 10);
      
      // 获取持仓
      const positions = contractEngine.getUserPositions('user123');
      expect(Array.isArray(positions)).toBe(true);
      expect(positions.length).toBeGreaterThan(0);
    });

    test('计算投资组合价值', async () => {
      // 先下单
      await contractEngine.placeOrder('user123', 'SH_FUTURE', 'buy', 10, 10);
      
      // 计算投资组合价值
      const portfolio = contractEngine.calculatePortfolioValue('user123');
      expect(portfolio.total_value).toBeGreaterThan(0);
      expect(portfolio.total_profit).toBeDefined();
      expect(portfolio.position_count).toBeGreaterThan(0);
    });

    test('获取订单历史', async () => {
      // 先下单
      await contractEngine.placeOrder('user123', 'SH_FUTURE', 'buy', 10, 10);
      
      // 获取订单历史
      const orderHistory = contractEngine.getOrderHistory('user123');
      expect(Array.isArray(orderHistory)).toBe(true);
      expect(orderHistory.length).toBeGreaterThan(0);
    });

    test('获取价格历史', () => {
      const priceHistory = contractEngine.getPriceHistory('SH_FUTURE');
      expect(Array.isArray(priceHistory)).toBe(true);
      expect(priceHistory.length).toBeGreaterThan(0);
    });

    test('错误的交易品种', async () => {
      try {
        await contractEngine.placeOrder('user123', 'INVALID_SYMBOL', 'buy', 10, 10);
        // 如果没有抛出异常，测试失败
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('交易品种');
      }
    });

    test('错误的交易方向', async () => {
      try {
        await contractEngine.placeOrder('user123', 'SH_FUTURE', 'invalid', 10, 10);
        // 如果没有抛出异常，测试失败
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('交易方向错误');
      }
    });

    test('超过最大杠杆', async () => {
      try {
        await contractEngine.placeOrder('user123', 'SH_FUTURE', 'buy', 10, 100);
        // 如果没有抛出异常，测试失败
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('杠杆超过最大限制');
      }
    });
  });

  describe('二元期权引擎', () => {
    let binaryEngine;

    beforeEach(() => {
      binaryEngine = new BinaryOptionEngine();
    });

    test('创建二元期权引擎实例', () => {
      expect(binaryEngine).toBeDefined();
      expect(binaryEngine.strategies).toBeDefined();
      expect(Object.keys(binaryEngine.strategies)).toHaveLength(6); // 更新为实际数量
    });

    test('获取交易策略', () => {
      const strategies = binaryEngine.getStrategies();
      expect(Array.isArray(strategies)).toBe(true);
      expect(strategies).toHaveLength(6); // 更新为实际数量
      expect(strategies[0].strategy_id).toBeDefined();
      expect(strategies[0].name).toBeDefined();
    });

    test('获取当前市场趋势', () => {
      const trend = binaryEngine.getCurrentTrend();
      expect(trend).toBeDefined();
      expect(trend.trend).toBeDefined();
      expect(trend.trend_text).toBeDefined();
      expect(trend.confidence).toBeDefined();
    });

    test('下二元期权订单', () => {
      const result = binaryEngine.placeBinaryOrder('user123', 'BINARY_1MIN', 'call', 100);
      expect(result.success).toBe(true);
      expect(result.order_id).toBeDefined();
      expect(result.investment).toBe(100);
      expect(result.potential_payout).toBeGreaterThan(0);
    });

    test('获取二元期权统计', () => {
      // 先下单
      binaryEngine.placeBinaryOrder('user123', 'BINARY_1MIN', 'call', 100);
      
      // 等待订单结算
      // 注意：在实际测试中，我们可能需要模拟时间或使用其他方法来测试结算功能
      
      // 获取统计
      const stats = binaryEngine.getBinaryStatistics('user123');
      expect(stats).toBeDefined();
      expect(stats.total_orders).toBeDefined();
    });

    test('获取交易策略历史', () => {
      const strategies = binaryEngine.getStrategies();
      expect(Array.isArray(strategies)).toBe(true);
      expect(strategies.length).toBeGreaterThan(0);
    });

    test('获取历史统计数据', () => {
      const history = binaryEngine.getHistoricalStatistics();
      expect(history).toBeDefined();
      expect(Object.keys(history).length).toBeGreaterThan(0);
    });

    test('错误的交易策略', () => {
      const result = binaryEngine.placeBinaryOrder('user123', 'INVALID_STRATEGY', 'call', 100);
      expect(result.success).toBe(false);
      expect(result.error).toBe('交易策略不存在');
    });

    test('错误的交易方向', () => {
      const result = binaryEngine.placeBinaryOrder('user123', 'BINARY_1MIN', 'invalid', 100);
      expect(result.success).toBe(false);
      expect(result.error).toBe('交易方向错误，必须是call或put');
    });

    test('超过最大投资限额', () => {
      const result = binaryEngine.placeBinaryOrder('user123', 'BINARY_1MIN', 'call', 20000);
      expect(result.success).toBe(false);
      expect(result.error).toContain('超过最大投资限额');
    });
  });

  describe('私募基金引擎', () => {
    let fundEngine;

    beforeEach(() => {
      fundEngine = new PrivateFundEngine();
    });

    test('创建私募基金引擎实例', () => {
      expect(fundEngine).toBeDefined();
      expect(fundEngine.funds).toBeDefined();
      expect(Object.keys(fundEngine.funds)).toHaveLength(7); // 更新为实际数量
    });

    test('获取基金信息', () => {
      const fundInfo = fundEngine.getFundInfo('FUND_K8');
      expect(fundInfo).toBeDefined();
      expect(fundInfo.fund_id).toBe('FUND_K8');
      expect(fundInfo.name).toBe('聚财日斗K8基金');
      expect(fundInfo.nav).toBeGreaterThan(0);
    });

    test('获取所有基金信息', () => {
      const allFunds = fundEngine.getAllFunds();
      expect(Array.isArray(allFunds)).toBe(true);
      expect(allFunds).toHaveLength(7); // 更新为实际数量
    });

    test('认购基金', () => {
      const result = fundEngine.subscribeFund('user123', 'FUND_K8', 50000);
      expect(result.success).toBe(true);
      expect(result.transaction_id).toBeDefined();
      expect(result.amount).toBe(50000);
      expect(result.shares).toBeGreaterThan(0);
    });

    test('获取用户基金持仓', () => {
      // 先认购基金
      fundEngine.subscribeFund('user123', 'FUND_K8', 50000);
      
      // 获取持仓
      const positions = fundEngine.getUserPositions('user123');
      expect(Array.isArray(positions)).toBe(true);
      expect(positions.length).toBeGreaterThan(0);
    });

    test('计算基金表现', () => {
      const performance = fundEngine.calculateFundPerformance('FUND_K8');
      expect(performance).toBeDefined();
      expect(performance.daily_return).toBeDefined();
      expect(performance.weekly_return).toBeDefined();
      expect(performance.monthly_return).toBeDefined();
      expect(performance.total_return).toBeDefined();
    });

    test('获取交易记录', () => {
      // 先认购基金
      fundEngine.subscribeFund('user123', 'FUND_K8', 50000);
      
      // 获取交易记录
      const transactions = fundEngine.getTransactionHistory('user123');
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
    });

    test('获取净值历史', () => {
      const navHistory = fundEngine.getNavHistory('FUND_K8');
      expect(Array.isArray(navHistory)).toBe(true);
      expect(navHistory.length).toBeGreaterThan(0);
    });

    test('错误的基金代码', () => {
      const result = fundEngine.subscribeFund('user123', 'INVALID_FUND', 50000);
      expect(result.success).toBe(false);
      expect(result.error).toBe('基金不存在');
    });

    test('投资金额不足', () => {
      const result = fundEngine.subscribeFund('user123', 'FUND_K8', 1000);
      expect(result.success).toBe(false);
      expect(result.error).toContain('投资金额低于最低要求');
    });
  });
});