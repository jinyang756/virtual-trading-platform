const VirtualTradingEngine = require('../../src/engine/VirtualTradingEngine');

describe('主交易系统集成测试', () => {
  let tradingSystem;
  
  beforeAll(() => {
    // 创建主交易系统实例
    tradingSystem = new VirtualTradingEngine();
  });
  
  afterAll(() => {
    // 清理资源
    if (tradingSystem && typeof tradingSystem.cleanup === 'function') {
      tradingSystem.cleanup();
    }
  });
  
  test('主交易系统初始化', () => {
    expect(tradingSystem).toBeDefined();
    expect(tradingSystem.contractEngine).toBeDefined();
    expect(tradingSystem.binaryEngine).toBeDefined();
    expect(tradingSystem.fundEngine).toBeDefined();
  });
  
  // ==================== 合约交易引擎测试 ====================
  
  test('合约交易引擎功能测试', async () => {
    // 获取市场数据
    const marketData = tradingSystem.getAllContractMarketData();
    expect(Array.isArray(marketData)).toBe(true);
    expect(marketData.length).toBeGreaterThan(0);
    
    // 下订单
    const orderResult = await tradingSystem.placeContractOrder('user123', 'SH_FUTURE', 'buy', 10, 10);
    expect(orderResult.success).toBe(true);
    expect(orderResult.order_id).toBeDefined();
    
    // 获取用户持仓
    const positions = tradingSystem.getContractUserPositions('user123');
    expect(Array.isArray(positions)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);
    
    // 计算投资组合价值
    const portfolio = tradingSystem.calculateContractPortfolioValue('user123');
    expect(portfolio.total_value).toBeGreaterThan(0);
  });
  
  // ==================== 二元期权引擎测试 ====================
  
  test('二元期权引擎功能测试', () => {
    // 获取策略
    const strategies = tradingSystem.getBinaryStrategies();
    expect(Array.isArray(strategies)).toBe(true);
    expect(strategies.length).toBeGreaterThan(0);
    
    // 获取市场趋势
    const trend = tradingSystem.getCurrentTrend();
    expect(trend.trend).toBeDefined();
    expect(trend.trend_text).toBeDefined();
    
    // 下订单
    const orderResult = tradingSystem.placeBinaryOrder('user123', 'BINARY_1MIN', 'call', 100);
    expect(orderResult.success).toBe(true);
    expect(orderResult.order_id).toBeDefined();
    
    // 获取统计信息
    const stats = tradingSystem.getBinaryStatistics('user123');
    expect(stats.total_orders).toBeDefined();
  });
  
  // ==================== 私募基金引擎测试 ====================
  
  test('私募基金引擎功能测试', () => {
    // 获取所有基金
    const funds = tradingSystem.getAllFunds();
    expect(Array.isArray(funds)).toBe(true);
    expect(funds.length).toBeGreaterThan(0);
    
    // 获取基金信息
    const fundInfo = tradingSystem.getFundInfo('FUND_K8');
    expect(fundInfo.fund_id).toBe('FUND_K8');
    expect(fundInfo.name).toBe('聚财日斗K8基金');
    
    // 认购基金
    const subscribeResult = tradingSystem.subscribeFund('user123', 'FUND_K8', 50000);
    expect(subscribeResult.success).toBe(true);
    expect(subscribeResult.transaction_id).toBeDefined();
    
    // 获取用户持仓
    const positions = tradingSystem.getFundUserPositions('user123');
    expect(Array.isArray(positions)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);
    
    // 计算基金表现
    const performance = tradingSystem.calculateFundPerformance('FUND_K8');
    expect(performance.daily_return).toBeDefined();
  });
  
  // ==================== 综合功能测试 ====================
  
  test('综合功能测试', () => {
    // 获取所有市场数据
    const allMarketData = tradingSystem.getAllMarketData();
    expect(allMarketData.contracts).toBeDefined();
    expect(allMarketData.funds).toBeDefined();
    
    // 获取用户投资组合
    const userPortfolio = tradingSystem.getUserPortfolio('user123');
    expect(userPortfolio.contracts).toBeDefined();
    expect(userPortfolio.funds).toBeDefined();
    expect(userPortfolio.binary).toBeDefined();
    
    // 获取用户所有持仓
    const allPositions = tradingSystem.getUserAllPositions('user123');
    expect(allPositions.contracts).toBeDefined();
    expect(allPositions.funds).toBeDefined();
  });
});