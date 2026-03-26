'use client';

import { useEffect } from 'react';
import { SignInForm } from '@/features/auth/components/SignInForm';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SigninPage() {
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    clearAuth();
    
    const cookiesToClear = ['accessToken', 'refreshToken', 'session'];
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    localStorage.clear();
    sessionStorage.clear();
    
  }, [clearAuth]);

  return <SignInForm />;
}
