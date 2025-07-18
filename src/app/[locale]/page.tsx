'use client';

import React, { useEffect } from 'react'; // 1. Import useEffect
import { Loading } from '@/components/Loading';
import { useRouter } from '@/lib/i18nNavigation';
import { useAuthStore } from '@/lib/store/authStore';

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
