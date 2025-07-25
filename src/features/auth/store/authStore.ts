import type { AuthState } from '@/features/auth/types';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { authService } from '@/features/auth/services/authService';

export const SESSION_HINT_KEY = 'session-active';

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  accessToken: null,
  status: 'loading',
  refreshTimerId: null,
  setAuth: (user, accessToken) => {
    const existingTimerId = useAuthStore.getState().refreshTimerId;
    if (existingTimerId) {
      clearTimeout(existingTimerId);
    }
    const decodedToken: { exp: number } = jwtDecode(accessToken);
    const expiresAt = decodedToken.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const refreshBuffer = 2000;
    const timeoutDuration = timeUntilExpiry + refreshBuffer;
    let newTimerId: NodeJS.Timeout | null = null;
    if (timeoutDuration > 0) {
      newTimerId = setTimeout(async () => {
        try {
          const { data: refreshData } = await authService.refreshToken({ _showToastOnError: false });
          const newToken = refreshData.data?.token;
          if (newToken) {
            useAuthStore.getState().setAuth(useAuthStore.getState().user!, newToken);
          } else {
            useAuthStore.getState().clearAuth();
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          useAuthStore.getState().clearAuth();
        }
      }, timeoutDuration);
    }
    localStorage.setItem(SESSION_HINT_KEY, 'true');
    set({ user, accessToken, status: 'authenticated', refreshTimerId: newTimerId });
  },
  setAccessToken: (accessToken) => {
    const user = useAuthStore.getState().user;
    if (user && accessToken) {
      useAuthStore.getState().setAuth(user, accessToken);
    } else {
      set({ accessToken });
    }
  },
  clearAuth: () => {
    const existingTimerId = useAuthStore.getState().refreshTimerId;
    if (existingTimerId) {
      clearTimeout(existingTimerId);
    }
    localStorage.removeItem(SESSION_HINT_KEY);
    set({ user: null, accessToken: null, status: 'unauthenticated', refreshTimerId: null });
  },
}));
