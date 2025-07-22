'use client';

import React, { useEffect } from 'react';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Loading } from '@/components/Loading';
import { useAuthorization } from '@/features/auth/hooks/useAuthorization';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';

function AuthorizationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthorized } = useAuthorization();
  useEffect(() => {
    if (!isAuthorized) {
      router.replace('/unauthorized');
    }
  }, [isAuthorized, router]);
  if (!isAuthorized) {
    return (
      <CenteredPageLayout>
        <Loading />
      </CenteredPageLayout>
    );
  }
  return <>{children}</>;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const status = useAuthStore(state => state.status);
  if (status !== 'authenticated') {
    return (
      <Loading />
    );
  }
  return (
    <>
      <AuthorizationGuard>{children}</AuthorizationGuard>
    </>
  );
}
