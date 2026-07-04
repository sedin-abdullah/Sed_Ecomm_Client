import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Order, OrderTrackingEvent, PaginatedResponse } from '@/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders', 'list'],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Order>>('/orders');
      return res.data.data ?? [];
    },
  });
}

// A customer sitting on their order page should see admin-driven status
// changes (confirmed → shipped → delivered) without a manual refresh, so these
// poll on an interval — but only while the tab is focused, to avoid pointless
// background traffic.
const ORDER_POLL_MS = 15_000;

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return res.data.data ?? null;
    },
    enabled: Boolean(id),
    refetchInterval: ORDER_POLL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useOrderTracking(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'track', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<OrderTrackingEvent[]>>(`/orders/${id}/track`);
      return res.data.data ?? [];
    },
    enabled: Boolean(id),
    refetchInterval: ORDER_POLL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/orders/${id}/cancel`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useReturnOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/orders/${id}/return`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useOrderInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'invoice', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/orders/${id}/invoice`);
      return res.data.data ?? null;
    },
    enabled: Boolean(id),
  });
}
