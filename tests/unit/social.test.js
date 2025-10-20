/**
 * 社交交易功能测试
 */

const UserFollow = require('../../src/models/UserFollow');
const TradeShare = require('../../src/models/TradeShare');
const TradeShareLike = require('../../src/models/TradeShareLike');
const TradeShareComment = require('../../src/models/TradeShareComment');

// Mock数据库连接
jest.mock('../../src/database/connection', () => ({
  executeQuery: jest.fn()
}));

const { executeQuery } = require('../../src/database/connection');

describe('社交交易功能测试', () => {
  beforeEach(() => {
    // 清除所有mock调用
    executeQuery.mockClear();
  });

  describe('用户关注功能测试', () => {
    test('应该能够创建关注关系', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const follow = new UserFollow('user1', 'user2');
      const result = await follow.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够取消关注', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const result = await UserFollow.unfollow('user1', 'user2');
      
      expect(result).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够检查是否已关注', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([{ count: 1 }]);
      
      const result = await UserFollow.isFollowing('user1', 'user2');
      
      expect(result).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });
  });

  describe('交易分享功能测试', () => {
    test('应该能够创建交易分享', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const share = new TradeShare('user1', 'trade1', '这是一笔不错的交易');
      const result = await share.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取用户的交易分享列表', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'share1', user_id: 'user1', trade_id: 'trade1', content: '分享1' },
        { id: 'share2', user_id: 'user1', trade_id: 'trade2', content: '分享2' }
      ]);
      
      const result = await TradeShare.getByUserId('user1');
      
      expect(result).toHaveLength(2);
      expect(executeQuery).toHaveBeenCalled();
    });
  });

  describe('点赞功能测试', () => {
    test('应该能够创建点赞', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const like = new TradeShareLike('share1', 'user1');
      const result = await like.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够取消点赞', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const result = await TradeShareLike.unlike('share1', 'user1');
      
      expect(result).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够检查是否已点赞', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([{ count: 1 }]);
      
      const result = await TradeShareLike.isLiked('share1', 'user1');
      
      expect(result).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });
  });

  describe('评论功能测试', () => {
    test('应该能够创建评论', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue({ affectedRows: 1 });
      
      const comment = new TradeShareComment('share1', 'user1', '很好的分析');
      const result = await comment.save();
      
      expect(result.success).toBe(true);
      expect(executeQuery).toHaveBeenCalled();
    });

    test('应该能够获取交易分享的评论列表', async () => {
      // Mock数据库返回结果
      executeQuery.mockResolvedValue([
        { id: 'comment1', share_id: 'share1', user_id: 'user1', content: '评论1' },
        { id: 'comment2', share_id: 'share1', user_id: 'user2', content: '评论2' }
      ]);
      
      const result = await TradeShareComment.getComments('share1');
      
      expect(result).toHaveLength(2);
      expect(executeQuery).toHaveBeenCalled();
    });
  });
});