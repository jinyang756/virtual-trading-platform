import apiClient from './api';
import { realtimeService } from './realtimeService';

export const tradingService = {
  // 获取市场数据
  getMarketData: (symbol: string) => apiClient.get(`/market/${symbol}`),
  
  // 获取交易历史
  getTradeHistory: (params: any) => apiClient.get('/trades/history', { params }),
  
  // 获取用户持仓
  getPositions: () => apiClient.get('/trades/positions/123'), // 假设用户ID为123，实际应从认证信息中获取
  
  // 下单交易
  placeTrade: async (tradeData: any) => {
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
  cancelOrder: (orderId: string) => apiClient.post(`/trades/${orderId}/cancel`),
  
  // 监听交易状态更新
  subscribeToTradeUpdates: (callback: (data: any) => void) => {
    return realtimeService.onTradeUpdate(callback);
  },
  
  // 监听市场价格更新
  subscribeToMarketUpdates: (symbol: string, callback: (data: any) => void) => {
    return realtimeService.onMarketUpdate((data: any) => {
      if (data.symbol === symbol || !symbol) {
        callback(data);
      }
    });
  }
};