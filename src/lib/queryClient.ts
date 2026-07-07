import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes — garbage collect unused cache
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: false, // don't refetch just because window regained focus
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
