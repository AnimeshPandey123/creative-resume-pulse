"use client";

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PerformanceOptimizer from '@/components/PerformanceOptimizer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceOptimizer>
          {children}
          <Toaster />
          <Sonner />
        </PerformanceOptimizer>
      </TooltipProvider>
    </QueryClientProvider>
  );
} 