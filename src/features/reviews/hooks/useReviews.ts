import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Review } from '@/types';

export function useReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`);
      return res.data.data ?? [];
    },
    enabled: Boolean(productId),
  });
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  images?: string[];
}

export function useCreateReview(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const res = await apiClient.post<ApiResponse<Review>>(`/products/${productId}/reviews`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'detail'] });
    },
  });
}

export function useLikeReview(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      await apiClient.post(`/reviews/${reviewId}/like`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', productId] }),
  });
}
