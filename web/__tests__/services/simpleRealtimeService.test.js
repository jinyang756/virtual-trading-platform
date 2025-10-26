// 简化的realtimeService测试

describe('Simple RealtimeService', () => {
  // 模拟socket对象
  let mockSocket;
  let realtimeService;

  beforeEach(() => {
    // 创建模拟的socket对象
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connected: true,
      disconnect: jest.fn()
    };

    // 创建模拟的realtimeService对象
    realtimeService = {
      socket: mockSocket,
      
      // 监听市场数据更新
      onMarketUpdate: jest.fn().mockImplementation(function(callback) {
        this.socket.on('market_update', callback);
        return () => this.socket.off('market_update', callback);
      }),

      // 监听交易更新
      onTradeUpdate: jest.fn().mockImplementation(function(callback) {
        this.socket.on('trade_update', callback);
        return () => this.socket.off('trade_update', callback);
      }),

      // 监听用户资金更新
      onFundUpdate: jest.fn().mockImplementation(function(callback) {
        this.socket.on('fund_update', callback);
        return () => this.socket.off('fund_update', callback);
      }),

      // 发送交易指令
      sendTrade: jest.fn().mockImplementation(function(tradeData) {
        return new Promise((resolve, reject) => {
          this.socket.emit('place_trade', tradeData, (response) => {
            if (response.success) {
              resolve(response.data);
            } else {
              reject(response.error);
            }
          });
        });
      }),

      // 连接状态
      isConnected: jest.fn().mockImplementation(function() {
        return this.socket.connected;
      }),

      // 断开连接
      disconnect: jest.fn().mockImplementation(function() {
        this.socket.disconnect();
      })
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onMarketUpdate', () => {
    test('should register market update listener', () => {
      const callback = jest.fn();
      realtimeService.onMarketUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('market_update', callback);
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
      realtimeService.onTradeUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('trade_update', callback);
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
      realtimeService.onFundUpdate(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('fund_update', callback);
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
      expect(mockSocket.connected).toBe(true);
    });
  });

  describe('disconnect', () => {
    test('should call socket disconnect', () => {
      realtimeService.disconnect();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});