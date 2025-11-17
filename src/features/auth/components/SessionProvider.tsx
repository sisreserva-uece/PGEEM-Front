'use client';

import React, { useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { useMe } from '../hooks/useMe';
import { useAuthStore } from '../store/authStore';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isError, isLoading } = useMe();
  const { setAuth, clearAuth, status } = useAuthStore();
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const token = useAuthStore.getState().accessToken;
        setAuth(user, token!);
      } else if (isError || status !== 'unauthenticated') {
        clearAuth();
      }
    }
  }, [user, isError, isLoading, setAuth, clearAuth, status]);
  if (status === 'loading') {
    return <Loading />;
  }
  return <>{children}</>;
}
