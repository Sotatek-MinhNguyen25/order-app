import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

interface QueryProviderProps {
    children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2,
                retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                staleTime: 60_000,   // 1 minute
                cacheTime: 300_000,  // 5 minutes
            },
            mutations: {
                retry: 1,
            },
        },
    }), []);

    const isDev = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_DEBUG === 'true';

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
};

export default QueryProvider;
