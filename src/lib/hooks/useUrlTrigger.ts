'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useRouter } from '@/lib/i18nNavigation';

/**
 * A hook to detect a trigger ID from a URL search parameter.
 * Returns the ID and a function to clear the parameter from the URL.
 * @param paramName The name of the search parameter to look for (e.g., 'open').
 * @returns A tuple containing the trigger ID (or null) and a memoized callback to clear it.
 */
export function useUrlTrigger(paramName: string): [string | null, () => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const triggerId = searchParams.get(paramName);
  const clearTrigger = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(paramName);
    const queryString = newParams.toString();
    const newPath = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    router.replace(newPath, { scroll: false });
  }, [router, searchParams, paramName]);
  return [triggerId, clearTrigger];
}
