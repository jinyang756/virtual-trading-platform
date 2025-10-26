const { realtimeService } = require('../../src/services/realtimeService');
const io = require('socket.io-client');

// Mock socket.io-client
jest.mock('socket.io-client');

describe('RealtimeService', () => {
  let mockSocket;
  let originalEnv;

  beforeEach(() => {
    // 保存原始环境变量
    originalEnv = process.env;
    
    // 创建mock socket对象
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connected: true,
      disconnect: jest.fn()
    };

    // Mock io函数返回mock socket
    io.mockReturnValue(mockSocket);
  });

  afterEach(() => {
    // 恢复环境变量
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    test('should create a singleton instance', () => {
      const instance1 = realtimeService;
      const instance2 = realtimeService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('constructor', () => {
    test('should initialize socket with default URL', () => {
      expect(io).toHaveBeenCalledWith('http://localhost:3001');
    });

    test('should initialize socket with environment URL', () => {
      process.env = { ...originalEnv, VITE_API_BASE: 'https://api.example.com' };
      
      // 重新创建实例以使用新的环境变量
      const RealtimeService = jest.requireActual('../../src/services/realtimeService').RealtimeService;
      new RealtimeService();
      
      expect(io).toHaveBeenCalledWith('https://api.example.com');
    });

    test('should setup event listeners', () => {
      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('onMarketUpdate', () => {
    test('should register market update listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onMarketUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('market_update', callback);
      expect(typeof unsubscribe).toBe('function');
    });

    test('unsubscribe should remove listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onMarketUpdate(callback);
      
      unsubscribe();
      
      expect(mockSocket.off).toHaveBeenCalledWith('market_update', callback);
    });
  });

  describe('onTradeUpdate', () => {
    test('should register trade update listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onTradeUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('trade_update', callback);
      expect(typeof unsubscribe).toBe('function');
    });

    test('unsubscribe should remove listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onTradeUpdate(callback);
      
      unsubscribe();
      
      expect(mockSocket.off).toHaveBeenCalledWith('trade_update', callback);
    });
  });

  describe('onFundUpdate', () => {
    test('should register fund update listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onFundUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('fund_update', callback);
      expect(typeof unsubscribe).toBe('function');
    });

    test('unsubscribe should remove listener', () => {
      const callback = jest.fn();
      const unsubscribe = realtimeService.onFundUpdate(callback);
      
      unsubscribe();
      
      expect(mockSocket.off).toHaveBeenCalledWith('fund_update', callback);
    });
  });

  describe('sendTrade', () => {
    test('should emit place_trade event and resolve with success response', async () => {
      const tradeData = {
        symbol: 'BTC/USDT',
        type: 'buy',
        quantity: 0.01
      };
      
      const mockResponse = {
        success: true,
        data: { orderId: '12345' }
      };
      
      // Mock emit callback
      mockSocket.emit.mockImplementation((event, data, callback) => {
        callback(mockResponse);
      });
      
      const result = await realtimeService.sendTrade(tradeData);
      
      expect(mockSocket.emit).toHaveBeenCalledWith('place_trade', tradeData, expect.any(Function));
      expect(result).toEqual(mockResponse.data);
    });

    test('should emit place_trade event and reject with error response', async () => {
      const tradeData = {
        symbol: 'BTC/USDT',
        type: 'buy',
        quantity: 0.01
      };
      
      const mockResponse = {
        success: false,
        error: '交易失败'
      };
      
      // Mock emit callback
      mockSocket.emit.mockImplementation((event, data, callback) => {
        callback(mockResponse);
      });
      
      await expect(realtimeService.sendTrade(tradeData))
        .rejects
        .toBe('交易失败');
    });
  });

  describe('isConnected', () => {
    test('should return socket connection status', () => {
      const isConnected = realtimeService.isConnected();
      expect(isConnected).toBe(true);
    });
  });

  describe('disconnect', () => {
    test('should call socket disconnect', () => {
      realtimeService.disconnect();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});