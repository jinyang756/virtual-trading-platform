import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { ErrorHandler } from './errorHandler';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { user } = useAuthStore.getState();
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        // 处理 token 过期
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
              const { user, updateUser } = useAuthStore.getState();
              if (user?.refreshToken) {
                const response = await this.client.post('/auth/refresh', {
                  refreshToken: user.refreshToken,
                });
                const { token } = response.data;
                updateUser({ token }); // 使用updateUser更新token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
            }
          } catch (refreshError) {
            ErrorHandler.handle(refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // User API
  public async login(credentials: { username: string; password: string }) {
    return this.client.post('/auth/login', credentials);
  }

  public async adminLogin(credentials: { username: string; password: string }) {
    return this.client.post('/auth/admin/login', credentials);
  }

  public async logout() {
    return this.client.post('/auth/logout');
  }

  public async getUserProfile() {
    return this.client.get('/user/profile');
  }

  // Fund API
  public async getFunds(params?: any) {
    return this.client.get('/funds', { params });
  }

  public async getFundDetails(id: string) {
    return this.client.get(`/funds/${id}`);
  }

  public async placeFundOrder(data: {
    fundId: string;
    amount: number;
    type: 'buy' | 'sell';
  }) {
    return this.client.post('/funds/orders', data);
  }

  // Binary Option API
  public async placeOptionOrder(data: {
    direction: 'up' | 'down';
    amount: number;
    duration: number;
  }) {
    return this.client.post('/binary-options/orders', data);
  }

  public async getActiveOptions() {
    return this.client.get('/binary-options/active');
  }

  // Contract API
  public async getContracts(exchange: string) {
    return this.client.get(`/contracts?exchange=${exchange}`);
  }

  public async placeContractOrder(data: {
    contractId: string;
    direction: 'long' | 'short';
    quantity: number;
    leverage: number;
    stopLoss?: number;
    takeProfit?: number;
  }) {
    return this.client.post('/contracts/orders', data);
  }

  public async closePosition(positionId: string) {
    return this.client.post(`/contracts/positions/${positionId}/close`);
  }

  // Admin API
  public async getUsers(params?: any) {
    return this.client.get('/admin/users', { params });
  }

  public async createUser(data: any) {
    return this.client.post('/admin/users', data);
  }

  public async updateUser(id: string, data: any) {
    return this.client.put(`/admin/users/${id}`, data);
  }

  public async deleteUser(id: string) {
    return this.client.delete(`/admin/users/${id}`);
  }

  public async getSystemSettings() {
    return this.client.get('/admin/settings');
  }

  public async updateSystemSettings(data: any) {
    return this.client.put('/admin/settings', data);
  }

  // Generic request method
  public async request<T = any>(config: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error);
      throw error;
    }
  }
}

export const apiClient = ApiClient.getInstance();
export default apiClient;