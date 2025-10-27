import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  role: string;
  token: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

type StorageValue = {
  state: {
    user: User | null;
    isAuthenticated: boolean;
  };
  version?: number;
};

const storage = {
  getItem: async (name: string): Promise<StorageValue | null> => {
    const item = localStorage.getItem(name);
    if (!item) return null;
    return JSON.parse(item) as StorageValue;
  },
  setItem: async (name: string, value: StorageValue): Promise<void> => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string): Promise<void> => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      }))
    }),
    {
      name: 'auth-storage',
      storage,
    }
  )
);