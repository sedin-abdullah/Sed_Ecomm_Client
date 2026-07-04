import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import { useCartCountStore } from '@/store/cartCountStore';
import type { ApiResponse, Cart } from '@/types';

const CART_KEY = ['cart'];

export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCartCount = useCartCountStore((state) => state.setCartCount);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Cart>>('/cart');
      return res.data.data ?? null;
    },
    enabled: isAuthenticated,
    // Cart data changes frequently, always fetch fresh on mount.
    // `always` forces a network fetch even if a cached value exists, so
    // navigating to /cart right after adding an item never shows stale/empty.
    refetchOnMount: 'always',
    staleTime: 0,
  });

  // When auth transitions from false -> true (e.g. refresh-token flow completes
  // AFTER the component has mounted), useQuery's `enabled` flip re-activates
  // the query, but React Query may still return the previous cached snapshot.
  // Explicitly invalidate here to guarantee the cart re-fetches with the fresh
  // auth token instead of showing an empty state until the user hits refresh.
  useEffect(() => {
    if (isAuthenticated) {
      // Use refetchQueries (not invalidateQueries) so the already-mounted
      // Header observer is forced to fetch immediately. The cart query lives
      // for the whole app because the Header calls useCart() for the badge, so
      // it never unmounts and refetchOnMount never re-triggers on /cart — an
      // explicit refetch on the login/hydration transition is what actually
      // repopulates it without a manual page refresh.
      queryClient.refetchQueries({ queryKey: CART_KEY });
    }
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    const count = query.data?.items.filter((item) => !item.savedForLater).reduce((sum, item) => sum + item.qty, 0) ?? 0;
    setCartCount(count);
  }, [query.data, isAuthenticated, setCartCount]);

  // TEMP DEBUG
  if (typeof window !== 'undefined') {
    console.log('[useCart]', new Date().toISOString().slice(11,23), {
      status: query.status,
      fetchStatus: query.fetchStatus,
      isAuthenticated,
      dataItems: query.data?.items?.length ?? 'none',
    });
  }

  return query;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { productId: string; variant?: { size?: string; color?: string }; qty: number }) => {
      const res = await apiClient.post<ApiResponse<Cart>>('/cart/items', payload);
      return res.data.data ?? null;
    },
    // The add-item endpoint returns the full updated cart. Write it straight
    // into the cache so navigating to /cart shows items immediately, with no
    // refetch race that would otherwise flash an empty cart on first mount.
    onSuccess: (cart) => {
      if (cart) queryClient.setQueryData(CART_KEY, cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: string; qty: number }) => {
      const res = await apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { qty });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useToggleSaveForLater() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiClient.post<ApiResponse<Cart>>(`/cart/items/${itemId}/save-for-later`);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await apiClient.post<ApiResponse<Cart>>('/cart/apply-coupon', { code });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<ApiResponse<Cart>>('/cart/remove-coupon');
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
