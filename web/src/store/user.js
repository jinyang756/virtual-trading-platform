import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      // 用户信息
      user: null,
      isAuthenticated: false,
      
      // 设置用户信息
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // 清除用户信息
      clearUser: () => set({ user: null, isAuthenticated: false }),
      
      // 更新用户信息
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
      
      // 获取用户ID
      getUserId: () => get().user?.id,
      
      // 检查是否已认证
      getIsAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: 'user-storage', // 存储的键名
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // 只持久化部分状态
    }
  )
);

export default useUserStore;