'use client';

import type React from 'react';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Loading } from '@/components/Loading';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ProtectedNavigation } from '@/features/nav-bar/components/ProtectedNavigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useAuthStore(state => state.status);

  if (status === 'loading') {
    return (
      <CenteredPageLayout>
        <Loading />
      </CenteredPageLayout>
    );
  }

  return (
    <div className="flex flex-col">
      <ProtectedNavigation />
      <CenteredPageLayout>
        {children}
      </CenteredPageLayout>
    </div>
  );
}
