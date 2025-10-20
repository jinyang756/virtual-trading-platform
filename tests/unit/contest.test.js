/**
 * 实时交易竞赛功能测试
 */

const TradingContest = require('../../src/models/TradingContest');
const ContestParticipant = require('../../src/models/ContestParticipant');
const ContestTrade = require('../../src/models/ContestTrade');

// Mock数据库连接
jest.mock('../../src/database/connection', () => ({
  executeQuery: jest.fn()
}));

const { executeQuery } = require('../../src/database/connection');

describe('实时交易竞赛功能测试', () => {
  beforeEach(() => {
    // 清除所有mock调用
    executeQuery.mockClear();
  });

  describe('交易竞赛功能测试', () => {
    test('应该能够创建交易竞赛', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const contest = new TradingContest('测试竞赛', '这是一个测试竞赛', '2025-11-01', '2025-11-30', 10000);
      const result = await contest.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取交易竞赛列表', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'contest1', name: '竞赛1', status: 'upcoming' },
        { id: 'contest2', name: '竞赛2', status: 'active' }
      ]);
      
      const result = await TradingContest.getAll();
      
      expect(result).toHaveLength(2);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够根据状态获取交易竞赛', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'contest1', name: '竞赛1', status: 'active' }
      ]);
      
      const result = await TradingContest.getByStatus('active');
      
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('active');
      expect(executeQuery).toHaveBeenCalled();
    });
  });

  describe('竞赛参与者功能测试', () => {
    test('应该能够创建竞赛参与者', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const participant = new ContestParticipant('contest1', 'user1', 100000);
      const result = await participant.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取竞赛参与者列表', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'participant1', contest_id: 'contest1', user_id: 'user1', current_balance: 105000 },
        { id: 'participant2', contest_id: 'contest1', user_id: 'user2', current_balance: 98000 }
      ]);
      
      const result = await ContestParticipant.getByContest('contest1');
      
      expect(result).toHaveLength(2);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够计算收益率', () => {
      const participant = new ContestParticipant('contest1', 'user1', 100000);
      participant.currentBalance = 110000;
      const returnRate = participant.calculateReturnRate();
      
      expect(returnRate).toBe(10);
    });
  });

  describe('竞赛交易记录功能测试', () => {
    test('应该能够创建竞赛交易记录', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const trade = new ContestTrade('contest1', 'participant1', 'BUY', 'BTCUSD', 1, 50000, 0);
      const result = await trade.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取竞赛交易记录', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'trade1', contest_id: 'contest1', participant_id: 'participant1', asset: 'BTCUSD', trade_type: 'BUY' },
        { id: 'trade2', contest_id: 'contest1', participant_id: 'participant2', asset: 'ETHUSD', trade_type: 'SELL' }
      ]);
      
      const result = await ContestTrade.getByContest('contest1');
      
      expect(result).toHaveLength(2);
      expect(executeQuery).toHaveBeenCalled();
    });
  });
});