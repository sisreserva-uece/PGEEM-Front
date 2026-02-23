import type { AuthState } from '@/features/auth/types';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  status: 'loading',
  setAuth: (user) => {
    set({ user, status: 'authenticated' });
  },
  clearAuth: () => {
    set({ user: null, status: 'unauthenticated' });
  },
}));
