'use client';

import type { QueryClient } from '@tanstack/react-query';
import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRef } from 'react';
import { makeQueryClient } from '@/lib/queryClient';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient | undefined>(undefined);
  if (!queryClientRef.current) {
    queryClientRef.current = makeQueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
