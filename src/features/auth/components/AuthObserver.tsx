'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';

/**
 * A client-side component that observes the global authentication status.
 * If the user becomes unauthenticated, it redirects them to the sign-in page,
 * unless they are already on a public page.
 * This component renders nothing.
 */
export function AuthObserver() {
  const status = useAuthStore(state => state.status);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    const isPublicPage = ['/signin', '/signup', '/unauthorized'].includes(pathname);
    if (status === 'unauthenticated' && !isPublicPage) {
      router.replace('/signin');
    }
  }, [status, pathname, router]);
  return null;
}
