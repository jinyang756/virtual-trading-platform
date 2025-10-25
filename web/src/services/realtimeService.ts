import io from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

class RealtimeService {
  private socket: any;
  private static instance: RealtimeService;

  private constructor() {
    // 使用可选链操作符访问环境变量
    this.socket = io(import.meta?.env?.VITE_API_BASE || 'http://localhost:3001');
    this.setupEventListeners();
  }

  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.authenticate();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  private authenticate() {
    const { user } = useAuthStore.getState();
    if (user?.token) {
      this.socket.emit('authenticate', { token: user.token });
    }
  }

  // 监听市场数据更新
  public onMarketUpdate(callback: (data: any) => void) {
    this.socket.on('market_update', callback);
    return () => this.socket.off('market_update', callback);
  }

  // 监听交易更新
  public onTradeUpdate(callback: (data: any) => void) {
    this.socket.on('trade_update', callback);
    return () => this.socket.off('trade_update', callback);
  }

  // 监听用户资金更新
  public onFundUpdate(callback: (data: any) => void) {
    this.socket.on('fund_update', callback);
    return () => this.socket.off('fund_update', callback);
  }

  // 发送交易指令
  public sendTrade(tradeData: any) {
    return new Promise((resolve, reject) => {
      this.socket.emit('place_trade', tradeData, (response: any) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }

  // 连接状态
  public isConnected() {
    return this.socket.connected;
  }

  // 断开连接
  public disconnect() {
    this.socket.disconnect();
  }
}

export const realtimeService = RealtimeService.getInstance();