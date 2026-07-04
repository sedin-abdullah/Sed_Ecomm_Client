import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import { useCartCountStore } from '@/store/cartCountStore';
import type { ApiResponse, Product } from '@/types';

const WISHLIST_KEY = ['wishlist'];

export function useWishlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWishlistCount = useCartCountStore((state) => state.setWishlistCount);

  const query = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => {
      // The API returns the wishlist document ({ products: Product[], ... }),
      // not a bare array — read the populated products off it.
      const res = await apiClient.get<ApiResponse<{ products: Product[] }>>('/wishlist');
      return res.data.data?.products ?? [];
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlistCount(0);
      return;
    }
    setWishlistCount(query.data?.length ?? 0);
  }, [query.data, isAuthenticated, setWishlistCount]);

  return query;
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    // Returns whether the product was already saved so callers can toast
    // "already in wishlist" vs "added". The wishlist query is mounted app-wide
    // (Header), so its cache is a reliable source for this; the backend dedupes
    // too, so we skip the redundant POST when it's already there.
    mutationFn: async (productId: string) => {
      const current = queryClient.getQueryData<Product[]>(WISHLIST_KEY) ?? [];
      const alreadyExists = current.some((p) => p.id === productId);
      if (!alreadyExists) await apiClient.post(`/wishlist/${productId}`);
      return { alreadyExists };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });
}
