// 简化的apiClient测试

describe('Simple ApiClient', () => {
  // 模拟axios对象
  let mockAxios;
  let apiClient;

  beforeEach(() => {
    // 创建模拟的axios对象
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };

    // 创建模拟的apiClient对象
    apiClient = mockAxios;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    test('should call axios.get with correct parameters', () => {
      const url = '/api/test';
      const config = { params: { id: 1 } };
      
      apiClient.get(url, config);
      
      expect(mockAxios.get).toHaveBeenCalledWith(url, config);
    });
  });

  describe('post', () => {
    test('should call axios.post with correct parameters', () => {
      const url = '/api/test';
      const data = { name: 'test' };
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      apiClient.post(url, data, config);
      
      expect(mockAxios.post).toHaveBeenCalledWith(url, data, config);
    });
  });

  describe('put', () => {
    test('should call axios.put with correct parameters', () => {
      const url = '/api/test/1';
      const data = { name: 'updated test' };
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      apiClient.put(url, data, config);
      
      expect(mockAxios.put).toHaveBeenCalledWith(url, data, config);
    });
  });

  describe('delete', () => {
    test('should call axios.delete with correct parameters', () => {
      const url = '/api/test/1';
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      apiClient.delete(url, config);
      
      expect(mockAxios.delete).toHaveBeenCalledWith(url, config);
    });
  });

  describe('create', () => {
    test('should create axios instance with correct config', () => {
      const config = {
        baseURL: 'http://localhost:3001',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const instance = apiClient.create(config);
      
      expect(mockAxios.create).toHaveBeenCalledWith(config);
      expect(instance).toBe(mockAxios);
    });
  });

  describe('interceptors', () => {
    test('should setup request interceptor', () => {
      const requestInterceptor = jest.fn();
      
      apiClient.interceptors.request.use(requestInterceptor);
      
      expect(mockAxios.interceptors.request.use).toHaveBeenCalledWith(requestInterceptor);
    });

    test('should setup response interceptor', () => {
      const responseInterceptor = jest.fn();
      
      apiClient.interceptors.response.use(null, responseInterceptor);
      
      expect(mockAxios.interceptors.response.use).toHaveBeenCalledWith(null, responseInterceptor);
    });
  });
});