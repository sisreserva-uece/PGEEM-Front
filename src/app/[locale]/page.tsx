'use client';

import React, { useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';

export default function RootPage() {
  const { status } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status === 'authenticated') {
      router.replace('/dashboard');
    } else {
      router.replace('/signin');
    }
  }, [status, router]);
  return <Loading />;
}
