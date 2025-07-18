import type { UserProfile } from '@/features/auth/types';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setAuth: (user: UserProfile) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      status: 'loading',
      setAuth: user => set({ user, status: 'authenticated' }),
      clearAuth: () => {
        Cookies.remove('token');
        set({ user: null, status: 'unauthenticated' });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.status = state.user ? 'authenticated' : 'unauthenticated';
        }
      },
      partialize: state => ({ user: state.user }),
    },
  ),
);
