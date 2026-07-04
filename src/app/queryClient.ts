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
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
