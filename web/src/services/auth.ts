import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { RequestQueue } from './requestQueue';

// 从环境变量获取基础 URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

// 请求类型接口定义
export interface LoginRequest {
  username: string;
  password: string;
  verifyCode?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'user';
    email?: string;
  };
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

class AuthService {
  private api: AxiosInstance;
  private requestQueue: RequestQueue;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 初始化请求队列
    this.requestQueue = new RequestQueue(this.api, this.refreshAccessToken.bind(this));

    // 注入认证 token
    this.api.interceptors.request.use(
      (config) => {
        const { user } = useAuthStore.getState();
        if (user?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 处理认证错误和 token 刷新
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // 处理 401 错误，尝试刷新 token
        if (error.response?.status === 401) {
          try {
            return await this.requestQueue.handle401Error(error);
          } catch (refreshError) {
            // 如果刷新 token 失败，清除用户状态并重定向到登录页
            useAuthStore.getState().logout();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 用户登录
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', data);
    return response.data;
  }

  // 管理员登录
  async adminLogin(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/admin/login', data);
    return response.data;
  }

  // 发送验证码
  async sendVerifyCode(username: string): Promise<void> {
    await this.api.post('/auth/verify-code', { username });
  }

  // 忘记密码
  async forgotPassword(email: string): Promise<void> {
    await this.api.post('/auth/forgot-password', { email });
  }

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await this.api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }

  // 验证 token 是否有效
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.api.get('/auth/validate');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // 刷新访问令牌
  private async refreshAccessToken(): Promise<string> {
    try {
      const { refreshToken } = useAuthStore.getState().user || {};
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post<TokenResponse>(
        '/auth/refresh',
        { refreshToken }
      );

      const { token: newToken, refreshToken: newRefreshToken } = response.data;
      
      // 更新 store 中的 token
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().login({
          ...currentUser,
          token: newToken,
          refreshToken: newRefreshToken
        });
      }

      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  // 登出
  async logout(): Promise<void> {
    try {
      const { refreshToken } = useAuthStore.getState().user || {};
      if (refreshToken) {
        await this.api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 无论服务端请求成功与否，都清除本地状态
      useAuthStore.getState().logout();
    }
  }
}

// 导出单例
export const authService = new AuthService();