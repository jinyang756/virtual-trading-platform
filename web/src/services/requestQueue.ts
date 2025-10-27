import { AxiosRequestConfig, AxiosError } from 'axios';

interface QueueItem {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}

export class RequestQueue {
  private isRefreshing: boolean = false;
  private failedQueue: QueueItem[] = [];
  private api: (config: AxiosRequestConfig) => Promise<any>;
  private onRefreshToken: () => Promise<string>;
  private refreshToken: string | null = null;

  constructor(
    api: (config: AxiosRequestConfig) => Promise<any>,
    onRefreshToken: () => Promise<string>
  ) {
    this.api = api;
    this.onRefreshToken = onRefreshToken;
  }

  // 处理 401 错误
  public async handle401Error(error: AxiosError): Promise<any> {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (this.isRefreshing) {
      // 如果正在刷新 token，将请求加入队列
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve,
          reject,
          config: originalRequest
        });
      });
    }

    this.isRefreshing = true;

    try {
      // 尝试刷新 token
      const newToken = await this.onRefreshToken();
      this.refreshToken = newToken;

      // 处理队列中的请求
      this.processQueue(null, newToken);

      // 重试当前请求
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return this.api(originalRequest);
    } catch (refreshError) {
      // 刷新失败，拒绝所有队列中的请求
      this.processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(item => {
      if (error) {
        item.reject(error);
      } else if (token) {
        if (item.config.headers) {
          item.config.headers.Authorization = `Bearer ${token}`;
        }
        item.resolve(this.api(item.config));
      }
    });
    this.failedQueue = [];
  }
}