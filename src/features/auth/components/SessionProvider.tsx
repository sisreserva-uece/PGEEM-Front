'use client';

import type { UserProfile } from '../types';
import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

type SessionProviderProps = {
  children: React.ReactNode;
  user: UserProfile | null;
  accessToken: string | null;
};

export function SessionProvider({ children, user, accessToken }: SessionProviderProps) {
  const setAuth = useAuthStore(state => state.setAuth);
  const initialized = useRef(false);
  if (!initialized.current) {
    if (user && accessToken) {
      setAuth(user, accessToken);
    }
    initialized.current = true;
  }
  useEffect(() => {
    if (user && accessToken) {
      setAuth(user, accessToken);
    }
  }, [user, accessToken, setAuth]);
  return <>{children}</>;
}
