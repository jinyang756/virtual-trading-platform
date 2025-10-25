import { Api } from '../api/Api';

// 创建API客户端实例
const apiClient = new Api({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
});

export default apiClient;