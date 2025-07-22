'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/features/auth/services/authService';
import { SESSION_HINT_KEY, useAuthStore } from '@/features/auth/store/authStore';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { status, setAuth, clearAuth, setAccessToken } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const initializeApp = async () => {
      const hasSessionHint = localStorage.getItem(SESSION_HINT_KEY);
      if (!hasSessionHint) {
        clearAuth();
        setIsInitialized(true);
        return;
      }
      try {
        const { data: refreshData } = await authService.refreshToken({ _showToastOnError: false });
        const token = refreshData.data?.token;
        setAccessToken(token);
        const { data: userResponse } = await authService.getMe({ _showToastOnError: false });
        const user = userResponse.data!;
        setAuth(user, token);
      } catch {
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };
    if (status === 'loading' && !isInitialized) {
      initializeApp();
    }
  }, [status, setAuth, clearAuth, setAccessToken, isInitialized]);
  return <>{children}</>;
}
