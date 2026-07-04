import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse, Product, ProductFacets, ProductFilters, ProductSuggestion } from '@/types';

const PAGE_LIMIT = 12;

/** Distinct brands/sizes/colors present in the catalog, for the shop filter panel. */
export function useProductFacets() {
  return useQuery({
    queryKey: ['products', 'facets'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ProductFacets>>('/products/facets');
      return res.data.data ?? { brands: [], sizes: [], colors: [] };
    },
    staleTime: 60_000,
  });
}

/** Infinite-scroll product listing, filtered/sorted per the /products contract. */
export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', 'list', filters],
    queryFn: async ({ pageParam }) => {
      const res = await apiClient.get<PaginatedResponse<Product>>('/products', {
        params: { ...filters, page: pageParam, limit: PAGE_LIMIT },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
      return res.data.data ?? null;
    },
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(id: string | undefined) {
  return useQuery({
    queryKey: ['products', 'related', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Product[]>>(`/products/${id}/related`);
      return res.data.data ?? [];
    },
    enabled: Boolean(id),
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['products', 'suggest', query],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ProductSuggestion[]>>('/products/search/suggest', {
        params: { q: query },
      });
      return res.data.data ?? [];
    },
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
  });
}
