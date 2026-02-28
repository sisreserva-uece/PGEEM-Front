'use client';

import type { UserProfile } from '../types';
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

type SessionProviderProps = {
  children: React.ReactNode;
  user: UserProfile | null;
};

export function SessionProvider({ children, user }: SessionProviderProps) {
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (user) {
      setAuth(user);
    } else {
      clearAuth();
    }
  }, [user, setAuth, clearAuth]);

  return <>{children}</>;
}
