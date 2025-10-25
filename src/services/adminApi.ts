import { Api } from '../api/Api';

// 创建API实例
const apiClient = new Api();

export const adminApi = {
  // 用户管理
  getUsers: (params: any) => apiClient.request({ path: '/admin/users', method: 'GET', query: params }),
  createUser: (userData: any) => apiClient.request({ path: '/admin/users', method: 'POST', body: userData }),
  updateUser: (id: string, userData: any) => apiClient.request({ path: `/admin/users/${id}`, method: 'PUT', body: userData }),
  deleteUser: (id: string) => apiClient.request({ path: `/admin/users/${id}`, method: 'DELETE' }),
  
  // 交易管理
  getTrades: (params: any) => apiClient.request({ path: '/admin/trades', method: 'GET', query: params }),
  updateTradeStatus: (id: string, status: string) => apiClient.request({ path: `/admin/trades/${id}/status`, method: 'PUT', body: { status } }),
  
  // 系统统计
  getSystemStats: () => apiClient.request({ path: '/admin/stats', method: 'GET' }),
  
  // 资金管理
  getFunds: (params: any) => apiClient.request({ path: '/admin/funds', method: 'GET', query: params }),
  adjustFunds: (userId: string, amount: number, reason: string) => apiClient.request({ 
    path: '/admin/funds/adjust', 
    method: 'POST', 
    body: {
      userId,
      amount,
      reason
    } 
  })
};