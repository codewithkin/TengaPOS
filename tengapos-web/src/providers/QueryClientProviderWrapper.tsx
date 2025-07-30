"use client";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react';

export const queryClient = new QueryClient();

function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryClientProviderWrapper
