/**
 * 数据分析和可视化功能测试
 */

const TradeAnalysis = require('../../src/models/TradeAnalysis');
const PortfolioAnalysis = require('../../src/models/PortfolioAnalysis');
const RiskAnalysis = require('../../src/models/RiskAnalysis');
const MarketPrediction = require('../../src/models/MarketPrediction');

// Mock数据库连接
jest.mock('../../src/database/connection', () => ({
  executeQuery: jest.fn()
}));

const { executeQuery } = require('../../src/database/connection');

describe('数据分析和可视化功能测试', () => {
  beforeEach(() => {
    // 清除所有mock调用
    executeQuery.mockClear();
  });

  describe('交易分析功能测试', () => {
    test('应该能够计算用户的交易统计数据', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([{
        total_trades: 100,
        buy_trades: 60,
        sell_trades: 40,
        avg_quantity: 1.5,
        avg_price: 50000,
        first_trade: '2025-01-01',
        last_trade: '2025-10-20'
      }]);
      
      const result = await TradeAnalysis.getUserTradeStats('user1');
      
      expect(result.total_trades).toBe(100);
      expect(result.buy_trades).toBe(60);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算用户的盈亏统计数据', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([{
        winning_trades: 60,
        losing_trades: 40,
        total_profit: 50000,
        total_loss: 30000,
        avg_profit_loss: 200,
        max_profit: 5000,
        max_loss: -3000
      }]);
      
      const result = await TradeAnalysis.getUserProfitStats('user1');
      
      expect(result.winning_trades).toBe(60);
      expect(result.total_profit).toBe(50000);
      expect(executeQuery).toHaveBeenCalled();
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
      executeQuery.mockResolvedValue([
        {
          asset: 'BTCUSD',
          quantity: 1,
          avg_price: 45000,
          current_price: 50000,
          market_value: 50000,
          unrealized_pnl: 5000,
          pnl_percentage: 11.11
        }
      ]);
      
      const result = await PortfolioAnalysis.getCurrentPositions('user1');
      
      expect(result).toHaveLength(1);
      expect(result[0].asset).toBe('BTCUSD');
      expect(result[0].market_value).toBe(50000);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算投资组合总价值', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([{
        total_value: 150000,
        cost_basis: 130000,
        total_pnl: 20000
      }]);
      
      const result = await PortfolioAnalysis.calculatePortfolioValue('user1');
      
      expect(result.total_value).toBe(150000);
      expect(result.total_pnl).toBe(20000);
      expect(executeQuery).toHaveBeenCalled();
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
      executeQuery.mockResolvedValue([
        { timestamp: '2025-10-20', price: 50000 },
        { timestamp: '2025-10-19', price: 49500 },
        { timestamp: '2025-10-18', price: 49000 },
        { timestamp: '2025-10-17', price: 48500 },
        { timestamp: '2025-10-16', price: 48000 }
      ]);
      
      const result = await MarketPrediction.movingAveragePrediction('BTCUSD');
      
      expect(result).toHaveProperty('trend');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('prediction');
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够进行RSI预测', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { timestamp: '2025-10-20', price: 50000 },
        { timestamp: '2025-10-19', price: 49500 },
        { timestamp: '2025-10-18', price: 49000 },
        { timestamp: '2025-10-17', price: 48500 },
        { timestamp: '2025-10-16', price: 48000 }
      ]);
      
      const result = await MarketPrediction.rsiPrediction('BTCUSD');
      
      expect(result).toHaveProperty('rsi');
      expect(result).toHaveProperty('signal');
      expect(result).toHaveProperty('prediction');
      expect(executeQuery).toHaveBeenCalled();
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