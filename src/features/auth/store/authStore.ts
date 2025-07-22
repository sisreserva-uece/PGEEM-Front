import type { AuthState } from '@/features/auth/types';
import { create } from 'zustand';

export const SESSION_HINT_KEY = 'session-active';

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  accessToken: null,
  status: 'loading',
  setAuth: (user, accessToken) => {
    localStorage.setItem(SESSION_HINT_KEY, 'true');
    set({ user, accessToken, status: 'authenticated' });
  },
  setAccessToken: accessToken => set(state => ({ ...state, accessToken })),
  clearAuth: () => {
    localStorage.removeItem(SESSION_HINT_KEY);
    set({ user: null, accessToken: null, status: 'unauthenticated' });
  },
}));
