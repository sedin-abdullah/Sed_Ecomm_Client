import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before considering it stale.
      // This means navigating between pages reuses cached data instantly
      // instead of re-fetching. Views that need live updates (order status,
      // cart, admin dashboard) override with their own staleTime.
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep cached data in memory for 10 minutes even after unmount,
      // so quickly navigating back to a page shows data instantly.
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      // Only refetch on window focus if data is stale (default: always).
      // This prevents unnecessary refetches when tabbing between pages.
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});
