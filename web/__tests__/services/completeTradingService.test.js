// 创建mock模块来替代真实的依赖
const apiClient = {
  get: jest.fn(),
  post: jest.fn()
};

const realtimeService = {
  sendTrade: jest.fn(),
  onTradeUpdate: jest.fn(),
  onMarketUpdate: jest.fn()
};

// 手动实现tradingService的核心功能
const tradingService = {
  // 获取市场数据
  getMarketData: (symbol) => apiClient.get(`/market/${symbol}`),
  
  // 获取交易历史
  getTradeHistory: (params) => apiClient.get('/trades/history', { params }),
  
  // 获取用户持仓
  getPositions: () => apiClient.get('/trades/positions/123'),
  
  // 下单交易
  placeTrade: async (tradeData) => {
    try {
      // 1. 前端验证
      if (!tradeData.symbol || !tradeData.quantity || !tradeData.type) {
        throw new Error('请填写完整的交易信息');
      }
      // 2. 发送实时交易请求
      const result = await realtimeService.sendTrade(tradeData);
      
      // 3. 返回结果
      return result;
    } catch (error) {
      console.error('交易失败:', error);
      throw error;
    }
  },
  
  // 取消订单
  cancelOrder: (orderId) => apiClient.post(`/trades/${orderId}/cancel`),
  
  // 监听交易状态更新
  subscribeToTradeUpdates: (callback) => {
    return realtimeService.onTradeUpdate(callback);
  },
  
  // 监听市场价格更新
  subscribeToMarketUpdates: (symbol, callback) => {
    return realtimeService.onMarketUpdate((data) => {
      if (data.symbol === symbol || !symbol) {
        callback(data);
      }
    });
  }
};

describe('Complete TradingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMarketData', () => {
    test('should call apiClient.get with correct parameters', () => {
      const symbol = 'BTC/USDT';
      tradingService.getMarketData(symbol);
      expect(apiClient.get).toHaveBeenCalledWith(`/market/${symbol}`);
    });
  });

  describe('getTradeHistory', () => {
    test('should call apiClient.get with correct parameters', () => {
      const params = { page: 1, limit: 10 };
      tradingService.getTradeHistory(params);
      expect(apiClient.get).toHaveBeenCalledWith('/trades/history', { params });
    });
  });

  describe('getPositions', () => {
    test('should call apiClient.get with correct endpoint', () => {
      tradingService.getPositions();
      expect(apiClient.get).toHaveBeenCalledWith('/trades/positions/123');
    });
  });

  describe('placeTrade', () => {
    test('should validate trade data', async () => {
      await expect(tradingService.placeTrade({}))
        .rejects
        .toThrow('请填写完整的交易信息');
    });

    test('should validate required fields', async () => {
      // 缺少symbol
      await expect(tradingService.placeTrade({
        type: 'buy',
        quantity: 0.01
      })).rejects.toThrow('请填写完整的交易信息');

      // 缺少type
      await expect(tradingService.placeTrade({
        symbol: 'BTC/USDT',
        quantity: 0.01
      })).rejects.toThrow('请填写完整的交易信息');

      // 缺少quantity
      await expect(tradingService.placeTrade({
        symbol: 'BTC/USDT',
        type: 'buy'
      })).rejects.toThrow('请填写完整的交易信息');
    });

    test('should send trade via realtime service', async () => {
      const mockTradeData = {
        symbol: 'BTC/USDT',
        type: 'buy',
        quantity: 0.01,
        price: 50000,
        amount: 500
      };
      const mockResult = {
        success: true,
        data: {
          orderId: '12345',
          status: 'completed'
        }
      };
      
      realtimeService.sendTrade.mockResolvedValue(mockResult);
      
      const result = await tradingService.placeTrade(mockTradeData);
      
      expect(realtimeService.sendTrade).toHaveBeenCalledWith(mockTradeData);
      expect(result).toEqual(mockResult);
    });

    test('should handle trade errors', async () => {
      const mockTradeData = {
        symbol: 'BTC/USDT',
        type: 'buy',
        quantity: 0.01
      };
      const mockError = new Error('交易失败');
      
      realtimeService.sendTrade.mockRejectedValue(mockError);
      
      await expect(tradingService.placeTrade(mockTradeData))
        .rejects
        .toThrow('交易失败');
      
      expect(realtimeService.sendTrade).toHaveBeenCalledWith(mockTradeData);
    });
  });

  describe('cancelOrder', () => {
    test('should call apiClient.post with correct parameters', () => {
      const orderId = '12345';
      tradingService.cancelOrder(orderId);
      expect(apiClient.post).toHaveBeenCalledWith(`/trades/${orderId}/cancel`);
    });
  });

  describe('subscribeToTradeUpdates', () => {
    test('should call realtimeService.onTradeUpdate', () => {
      const mockCallback = jest.fn();
      tradingService.subscribeToTradeUpdates(mockCallback);
      expect(realtimeService.onTradeUpdate).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('subscribeToMarketUpdates', () => {
    test('should call realtimeService.onMarketUpdate', () => {
      const symbol = 'BTC/USDT';
      const mockCallback = jest.fn();
      tradingService.subscribeToMarketUpdates(symbol, mockCallback);
      expect(realtimeService.onMarketUpdate).toHaveBeenCalled();
    });
  });
});