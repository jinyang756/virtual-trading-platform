const axios = require('axios');
const apiClient = require('../../src/services/api');

// Mock axios
jest.mock('axios');

describe('apiClient', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    global.localStorage.clear();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('configuration', () => {
    test('should be configured with default baseURL', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: '/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    test('should be configured with environment baseURL', () => {
      process.env = { ...originalEnv, VITE_API_BASE: 'https://api.example.com' };
      
      // 重新导入模块以使用新的环境变量
      jest.resetModules();
      const apiModule = require('../../src/services/api');
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('request interceptor', () => {
    let requestInterceptor;

    beforeEach(() => {
      // 获取请求拦截器
      const interceptorCall = axios.interceptors.request.use;
      requestInterceptor = interceptorCall.mock.calls[0][0];
    });

    test('should add token to Authorization header when token exists', () => {
      const token = 'test-token';
      global.localStorage.setItem('token', token);
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('should not add Authorization header when no token exists', () => {
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    let responseInterceptor;
    let originalLocation;

    beforeEach(() => {
      // 保存原始window.location
      originalLocation = global.window.location;
      
      // Mock window.location
      delete global.window.location;
      global.window.location = { href: '' };
      
      // 获取响应拦截器
      const interceptorCall = axios.interceptors.response.use;
      responseInterceptor = interceptorCall.mock.calls[0][1];
    });

    afterEach(() => {
      // 恢复window.location
      global.window.location = originalLocation;
    });

    test('should handle 401 error by removing token and redirecting to login', () => {
      const token = 'test-token';
      global.localStorage.setItem('token', token);
      
      const error = {
        response: {
          status: 401
        }
      };
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(global.localStorage.getItem('token')).toBeNull();
      expect(global.window.location.href).toBe('/login');
    });

    test('should handle 403 error by logging permission error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        response: {
          status: 403
        }
      };
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('权限不足');
      
      consoleSpy.mockRestore();
    });

    test('should handle 404 error by logging not found error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        response: {
          status: 404
        }
      };
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('请求的资源不存在');
      
      consoleSpy.mockRestore();
    });

    test('should handle 500 error by logging server error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        response: {
          status: 500
        }
      };
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('服务器内部错误');
      
      consoleSpy.mockRestore();
    });

    test('should handle network error by logging connection error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {};
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('网络连接失败');
      
      consoleSpy.mockRestore();
    });

    test('should handle response with message by logging the message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Bad Request'
          }
        }
      };
      
      expect(() => responseInterceptor(error)).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('请求失败:', 'Bad Request');
      
      consoleSpy.mockRestore();
    });
  });
});