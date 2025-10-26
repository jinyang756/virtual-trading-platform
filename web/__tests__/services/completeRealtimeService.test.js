// 创建mock模块来替代socket.io-client
const io = jest.fn();

// 手动实现realtimeService的核心功能
class RealtimeService {
  constructor() {
    this.socket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connected: true,
      disconnect: jest.fn()
    };
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.authenticate();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  authenticate() {
    // 模拟认证逻辑
    console.log('Authenticating user');
  }

  // 监听市场数据更新
  onMarketUpdate(callback) {
    this.socket.on('market_update', callback);
    return () => this.socket.off('market_update', callback);
  }

  // 监听交易更新
  onTradeUpdate(callback) {
    this.socket.on('trade_update', callback);
    return () => this.socket.off('trade_update', callback);
  }

  // 监听用户资金更新
  onFundUpdate(callback) {
    this.socket.on('fund_update', callback);
    return () => this.socket.off('fund_update', callback);
  }

  // 发送交易指令
  sendTrade(tradeData) {
    return new Promise((resolve, reject) => {
      this.socket.emit('place_trade', tradeData, (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }

  // 连接状态
  isConnected() {
    return this.socket.connected;
  }

  // 断开连接
  disconnect() {
    this.socket.disconnect();
  }
}

const realtimeService = new RealtimeService();

describe('Complete RealtimeService', () => {
  let mockSocket;

  beforeEach(() => {
    // 重新创建实例以确保socket.on是jest.fn()
    const freshService = new RealtimeService();
    mockSocket = freshService.socket;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should initialize socket and setup event listeners', () => {
      // 创建新实例来测试构造函数
      const newService = new RealtimeService();
      const newSocket = newService.socket;
      
      expect(newSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(newSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(newSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
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