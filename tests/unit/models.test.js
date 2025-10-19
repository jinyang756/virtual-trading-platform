const User = require('../../src/models/User');
const Config = require('../../src/models/Config');
const Transaction = require('../../src/models/Transaction');
const Position = require('../../src/models/Position');
const MarketData = require('../../src/models/MarketData');

describe('数据模型测试', () => {
  describe('用户模型', () => {
    test('创建用户实例', () => {
      const user = new User('U123', 'testuser', 'test@example.com', 'password123', 100000);
      expect(user.id).toBe('U123');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('password123');
      expect(user.balance).toBe(100000);
    });
  });

  describe('配置模型', () => {
    test('创建配置实例', () => {
      // 这些是静态方法，不需要实例化
      expect(typeof Config.getAll).toBe('function');
      expect(typeof Config.get).toBe('function');
      expect(typeof Config.set).toBe('function');
      expect(typeof Config.update).toBe('function');
    });
  });

  describe('交易模型', () => {
    test('创建交易实例', () => {
      const transaction = new Transaction('T123', 'U123', 'BTC', 'buy', 1, 30000);
      expect(transaction.id).toBe('T123');
      expect(transaction.userId).toBe('U123');
      expect(transaction.asset).toBe('BTC');
      expect(transaction.type).toBe('buy');
      expect(transaction.quantity).toBe(1);
      expect(transaction.price).toBe(30000);
      expect(transaction.status).toBe('pending');
    });
  });

  describe('持仓模型', () => {
    test('创建持仓实例', () => {
      const position = new Position('P123', 'U123', 'BTC', 1, 30000);
      expect(position.id).toBe('P123');
      expect(position.userId).toBe('U123');
      expect(position.asset).toBe('BTC');
      expect(position.quantity).toBe(1);
      expect(position.avgPrice).toBe(30000);
      expect(position.leverage).toBe(1);
    });
  });

  describe('市场数据模型', () => {
    test('创建市场数据实例', () => {
      // 这些是静态方法
      expect(typeof MarketData.getAll).toBe('function');
      expect(typeof MarketData.getPrice).toBe('function');
      expect(typeof MarketData.getHistory).toBe('function');
      expect(typeof MarketData.update).toBe('function');
    });
  });
});