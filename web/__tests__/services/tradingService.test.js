import { tradingService } from '../../src/services/tradingService';
import apiClient from '../../src/services/api';
import { realtimeService } from '../../src/services/realtimeService';

// Mock依赖
jest.mock('../../src/services/api');
jest.mock('../../src/services/realtimeService');

describe('TradingService', () => {
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
