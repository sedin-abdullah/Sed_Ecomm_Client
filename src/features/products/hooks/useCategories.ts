import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'list'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data.data ?? [];
    },
    // Categories change rarely but should still reflect admin edits promptly;
    // a short stale window lets the global refetch-on-focus pick them up.
    staleTime: 60_000,
  });
}

export function useCategory(slug: string | undefined) {
  return useQuery({
    queryKey: ['categories', 'detail', slug],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
      return res.data.data ?? null;
    },
    enabled: Boolean(slug),
  });
}
