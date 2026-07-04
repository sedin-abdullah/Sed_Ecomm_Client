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

  const query = useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Cart>>('/cart');
      return res.data.data ?? null;
    },
    enabled: isAuthenticated,
    // Cart data changes frequently, always fetch fresh on mount
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    const count = query.data?.items.filter((item) => !item.savedForLater).reduce((sum, item) => sum + item.qty, 0) ?? 0;
    setCartCount(count);
  }, [query.data, isAuthenticated, setCartCount]);

  return query;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { productId: string; variant?: { size?: string; color?: string }; qty: number }) => {
      const res = await apiClient.post<ApiResponse<Cart>>('/cart/items', payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
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
