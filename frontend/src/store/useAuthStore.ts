import { create } from 'zustand';
import api from '../api/axios';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  checkAuth: async () => {
    try {
      // Create a small /auth/me route in NestJS to verify the cookie
      const res = await api.get('/auth/me'); 
      set({ user: res.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));