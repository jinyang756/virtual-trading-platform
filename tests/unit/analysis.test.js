/**
 * 数据分析和可视化功能测试
 */

const TradeAnalysis = require('../../src/models/TradeAnalysis');
const PortfolioAnalysis = require('../../src/models/PortfolioAnalysis');
const RiskAnalysis = require('../../src/models/RiskAnalysis');
const MarketPrediction = require('../../src/models/MarketPrediction');

// Mock数据库适配器
jest.mock('../../src/database/dbAdapter', () => ({
  executeQuery: jest.fn()
}));

const dbAdapter = require('../../src/database/dbAdapter');

describe('数据分析和可视化功能测试', () => {
  beforeEach(() => {
    // 清除所有mock调用
    dbAdapter.executeQuery.mockClear();
  });

  describe('交易分析功能测试', () => {
    test('应该能够计算用户的交易统计数据', async () => {
      // Mock数据库返回结果
      dbAdapter.executeQuery.mockResolvedValue({
        records: [
          { fields: { id: 'trade1', user_id: 'user1', type: 'buy', quantity: 1, price: 50000, timestamp: '2025-10-20' } },
          { fields: { id: 'trade2', user_id: 'user1', type: 'sell', quantity: 1, price: 51000, timestamp: '2025-10-21' } }
        ]
      });
      
      const result = await TradeAnalysis.getUserTradeStats('user1');
      
      expect(result).toHaveProperty('total_trades');
      expect(result).toHaveProperty('buy_trades');
      expect(dbAdapter.executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算用户的盈亏统计数据', async () => {
      // Mock数据库返回结果
      dbAdapter.executeQuery
        .mockResolvedValueOnce({ records: [
          { fields: { id: 'order1', user_id: 'user1', exit_price: 51000, entry_price: 50000, amount: 1, status: 'CLOSED' } }
        ]})
        .mockResolvedValueOnce({ records: [
          { fields: { id: 'binary1', user_id: 'user1', payout: 1000, status: 'SETTLED' } }
        ]});
      
      const result = await TradeAnalysis.getUserProfitStats('user1');
      
      expect(result).toHaveProperty('winning_trades');
      expect(result).toHaveProperty('total_profit');
      expect(dbAdapter.executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算交易胜率', async () => {
      const winRate = await TradeAnalysis.calculateWinRate(60, 100);
      
      expect(winRate).toBe(60);
    });

    test('应该能够计算盈亏比', async () => {
      const profitFactor = await TradeAnalysis.calculateProfitFactor(50000, 30000);
      
      expect(profitFactor).toBeCloseTo(1.67);
    });
  });

  describe('投资组合分析功能测试', () => {
    test('应该能够获取用户当前持仓', async () => {
      // Mock数据库返回结果
      dbAdapter.executeQuery.mockResolvedValue({
        records: [
          { fields: { id: 'position1', user_id: 'user1', asset: 'BTCUSD', quantity: 1, avg_price: 45000 } }
        ]
      });
      
      const result = await PortfolioAnalysis.getCurrentPositions('user1');
      
      expect(Array.isArray(result)).toBe(true);
      expect(dbAdapter.executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算投资组合总价值', async () => {
      // Mock getCurrentPositions 方法
      jest.spyOn(PortfolioAnalysis, 'getCurrentPositions').mockResolvedValue([
        { asset: 'BTCUSD', quantity: 1, avg_price: 45000, current_price: 50000, market_value: 50000 }
      ]);
      
      const result = await PortfolioAnalysis.calculatePortfolioValue('user1');
      
      expect(result).toHaveProperty('total_value');
      expect(result).toHaveProperty('cost_basis');
      expect(result).toHaveProperty('total_pnl');
    });
  });

  describe('收益风险分析功能测试', () => {
    test('应该能够计算夏普比率', async () => {
      // Mock getUserReturns方法
      jest.spyOn(RiskAnalysis, 'getUserReturns').mockResolvedValue([
        { return_rate: 0.01 },
        { return_rate: 0.02 },
        { return_rate: -0.005 },
        { return_rate: 0.015 },
        { return_rate: 0.008 }
      ]);
      
      const result = await RiskAnalysis.calculateSharpeRatio('user1');
      
      expect(typeof result).toBe('number');
    });

    test('应该能够计算最大回撤', async () => {
      // Mock getAccountHistory方法
      jest.spyOn(RiskAnalysis, 'getAccountHistory').mockResolvedValue([
        { date: '2025-01-01', account_value: 100000 },
        { date: '2025-01-02', account_value: 105000 },
        { date: '2025-01-03', account_value: 95000 },
        { date: '2025-01-04', account_value: 98000 }
      ]);
      
      const result = await RiskAnalysis.calculateMaxDrawdown('user1');
      
      expect(typeof result).toBe('number');
    });

    test('应该能够获取风险指标概览', async () => {
      // Mock相关方法
      jest.spyOn(RiskAnalysis, 'calculateSharpeRatio').mockResolvedValue(1.2);
      jest.spyOn(RiskAnalysis, 'calculateMaxDrawdown').mockResolvedValue(15);
      jest.spyOn(RiskAnalysis, 'calculateVaR').mockResolvedValue(0.02);
      
      const result = await RiskAnalysis.getRiskOverview('user1');
      
      expect(result.sharpe_ratio).toBe(1.2);
      expect(result.max_drawdown).toBe(15);
      expect(result.value_at_risk).toBe(0.02);
    });
  });

  describe('市场趋势预测功能测试', () => {
    test('应该能够进行移动平均线预测', async () => {
      // Mock数据库返回结果
      dbAdapter.executeQuery.mockResolvedValue({
        records: [
          { fields: { timestamp: '2025-10-20', price: 50000 } },
          { fields: { timestamp: '2025-10-19', price: 49500 } },
          { fields: { timestamp: '2025-10-18', price: 49000 } },
          { fields: { timestamp: '2025-10-17', price: 48500 } },
          { fields: { timestamp: '2025-10-16', price: 48000 } }
        ]
      });
      
      const result = await MarketPrediction.movingAveragePrediction('BTCUSD');
      
      expect(result).toHaveProperty('trend');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('prediction');
      expect(dbAdapter.executeQuery).toHaveBeenCalled();
    });

    test('应该能够进行RSI预测', async () => {
      // Mock数据库返回结果
      dbAdapter.executeQuery.mockResolvedValue({
        records: [
          { fields: { timestamp: '2025-10-20', price: 50000 } },
          { fields: { timestamp: '2025-10-19', price: 49500 } },
          { fields: { timestamp: '2025-10-18', price: 49000 } },
          { fields: { timestamp: '2025-10-17', price: 48500 } },
          { fields: { timestamp: '2025-10-16', price: 48000 } }
        ]
      });
      
      const result = await MarketPrediction.rsiPrediction('BTCUSD');
      
      expect(result).toHaveProperty('rsi');
      expect(result).toHaveProperty('signal');
      expect(result).toHaveProperty('prediction');
      expect(dbAdapter.executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取综合预测', async () => {
      // Mock相关方法
      jest.spyOn(MarketPrediction, 'movingAveragePrediction').mockResolvedValue({
        trend: 'bullish',
        confidence: 0.7,
        prediction: '看涨趋势'
      });
      
      jest.spyOn(MarketPrediction, 'rsiPrediction').mockResolvedValue({
        rsi: 65,
        signal: 'neutral',
        prediction: '正常区间'
      });
      
      jest.spyOn(MarketPrediction, 'getPriceVolatility').mockResolvedValue({
        volatility: 0.02,
        annualized_volatility: 0.32
      });
      
      const result = await MarketPrediction.getComprehensivePrediction('BTCUSD');
      
      expect(result).toHaveProperty('symbol', 'BTCUSD');
      expect(result).toHaveProperty('overall_signal');
      expect(result).toHaveProperty('confidence');
    });
  });
});