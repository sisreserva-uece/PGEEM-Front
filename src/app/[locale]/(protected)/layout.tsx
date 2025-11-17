'use client';

import React, { useEffect } from 'react';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Loading } from '@/components/Loading';
import { useAuthorization } from '@/features/auth/hooks/useAuthorization';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';

/**
 * This inner component handles Authorization (permissions), checking if an
 * already authenticated user has the required roles for a specific page.
 * Its logic remains unchanged.
 */
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

/**
 * This is the main Layout component for all protected routes.
 * It is now the single source of truth for handling Authentication.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const status = useAuthStore(state => state.status);
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);
  if (status !== 'authenticated') {
    return <Loading />;
  }
  return <AuthorizationGuard>{children}</AuthorizationGuard>;
}
