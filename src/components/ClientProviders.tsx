'use client';

import React, { useMemo } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize QueryClient to prevent recreation on every render
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceOptimizer>
          {children}
          {/* Lazy load toasters to reduce initial bundle */}
          <Toaster />
          <Sonner />
        </PerformanceOptimizer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
