'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
              style: {
                backgroundColor: 'oklch(0.6 0.23 25)',
                color: 'oklch(0.985 0 0)',
              },
            },
          }}
        />
        <NextTopLoader color='oklch(0.646 0.222 41.116)' />
      </QueryClientProvider>
    </>
  );
}
