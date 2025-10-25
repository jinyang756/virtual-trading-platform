import apiClient from './api';

export const adminApi = {
  // 用户管理
  getUsers: (params: any) => apiClient.get('/admin/users', { params }),
  createUser: (userData: any) => apiClient.post('/admin/users', userData),
  updateUser: (id: string, userData: any) => apiClient.put(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  
  // 交易管理
  getTrades: (params: any) => apiClient.get('/admin/trades', { params }),
  updateTradeStatus: (id: string, status: string) => apiClient.put(`/admin/trades/${id}/status`, { status }),
  
  // 系统统计
  getSystemStats: () => apiClient.get('/admin/stats'),
  
  // 资金管理
  getFunds: (params: any) => apiClient.get('/admin/funds', { params }),
  adjustFunds: (userId: string, amount: number, reason: string) => apiClient.post('/admin/funds/adjust', {
    userId,
    amount,
    reason
  })
};