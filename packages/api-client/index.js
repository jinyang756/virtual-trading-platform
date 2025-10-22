// API客户端包
const axios = require('axios');

class ApiClient {
  constructor(baseURL, timeout = 10000) {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 添加请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        // 对请求错误做些什么
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        // 对响应数据做点什么
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response.data;
      },
      (error) => {
        // 对响应错误做点什么
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 设置认证令牌
   * @param {string} token - 认证令牌
   */
  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 清除认证令牌
   */
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @returns {Promise} 响应数据
   */
  async get(url, params = {}) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @returns {Promise} 响应数据
   */
  async post(url, data = {}) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @returns {Promise} 响应数据
   */
  async put(url, data = {}) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @returns {Promise} 响应数据
   */
  async delete(url) {
    const response = await this.client.delete(url);
    return response.data;
  }

  /**
   * PATCH请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @returns {Promise} 响应数据
   */
  async patch(url, data = {}) {
    const response = await this.client.patch(url, data);
    return response.data;
  }
}

module.exports = ApiClient;