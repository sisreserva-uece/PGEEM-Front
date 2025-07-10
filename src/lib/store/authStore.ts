import type { UserProfile } from '@/features/auth/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: token => set({ token, isAuthenticated: true }),
      setUser: user => set(state => ({ ...state, user })),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
