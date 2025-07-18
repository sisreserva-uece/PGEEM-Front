'use client';

import type React from 'react';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';
import { Loading } from '@/components/Loading';
import { ProtectedNavigation } from '@/features/navigation/components/ProtectedNavigation';
import { useAuthStore } from '@/lib/store/authStore';

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
    <>
      <ProtectedNavigation />
      <CenteredPageLayout>
        {children}
      </CenteredPageLayout>
    </>
  );
}
