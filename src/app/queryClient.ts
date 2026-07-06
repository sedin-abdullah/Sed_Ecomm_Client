import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep customer-facing data loosely in sync with admin changes without a
      // realtime layer: a short stale window plus refetch-on-focus/reconnect
      // means switching back to a tab (or an admin editing in another tab)
      // surfaces fresh products/prices/stock/coupons within seconds. Views that
      // need truly live updates (order status) add their own refetchInterval.
      staleTime: 15_000,
      // The API is on a free tier that sleeps when idle; the first request can
      // 502/time out for ~50s while it cold-starts. Retry several times with a
      // capped backoff so a waking server recovers on its own instead of the
      // user seeing an empty page.
      retry: 4,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
