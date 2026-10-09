import { QueryClient } from '@tanstack/react-query';
import { QUERY_DEFAULTS } from '../config/constants';

/**
 * Enterprise QueryClient configured with medical-safe caching and retry policies.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_DEFAULTS.STALE_TIME_DEFAULT,
      gcTime: QUERY_DEFAULTS.GC_TIME,
      retry: (failureCount, error) => {
        // Do not retry 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < QUERY_DEFAULTS.MAX_RETRIES;
      },
      refetchOnWindowFocus: false, // Prevent interrupting clinical note taking
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
