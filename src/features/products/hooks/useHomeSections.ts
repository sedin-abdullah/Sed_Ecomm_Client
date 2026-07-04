import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { PaginatedResponse, Product, ProductFilters } from '@/types';

/**
 * The API contract exposes a single flexible `/products` listing endpoint
 * (no bespoke "trending"/"best-sellers" routes), so each Home rail is just a
 * differently-sorted/filtered slice of it, each cached under its own key.
 */
function useProductRow(key: string, params: ProductFilters & { limit?: number }) {
  return useQuery({
    queryKey: ['products', 'row', key, params],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Product>>('/products', {
        params: { page: 1, limit: 10, ...params },
      });
      return res.data.data ?? [];
    },
    staleTime: 60_000,
  });
}

export const useTrendingProducts = () => useProductRow('trending', { sort: 'popular' });
export const useNewArrivals = () => useProductRow('new-arrivals', { sort: 'newest' });
export const useRecommendedProducts = () => useProductRow('recommended', { sort: 'rating' });
export const useBestSellers = () => useProductRow('best-sellers', { sort: 'popular', limit: 8 });
/** "Flash sale" surfaces genuinely discounted stock; the deadline is a client-side daily countdown (no backend flag for it). */
export const useFlashSaleProducts = () => useProductRow('flash-sale', { sort: 'price_asc', onSale: true });

export function useRecentlyViewedProducts(ids: string[]) {
  return useQuery({
    queryKey: ['products', 'recently-viewed', ids],
    queryFn: async () => {
      const results = await Promise.all(
        ids.map((id) =>
          apiClient
            .get<{ success: boolean; data?: Product }>(`/products/${id}`)
            .then((res) => res.data.data)
            .catch(() => null),
        ),
      );
      return results.filter((product): product is Product => Boolean(product));
    },
    enabled: ids.length > 0,
    staleTime: 60_000,
  });
}

/** Midnight-tonight, computed once per day — stable across reloads. */
export function getFlashSaleEndsAt(): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}
