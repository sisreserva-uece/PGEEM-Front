'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from '@/lib/i18nNavigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
    }
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
