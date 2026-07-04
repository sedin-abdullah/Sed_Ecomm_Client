import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Address, ApiResponse, Order } from '@/types';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Address[]>>('/users/addresses');
      return res.data.data ?? [];
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const res = await apiClient.post<ApiResponse<Address>>('/users/addresses', address);
      return res.data.data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Omit<Address, 'id'>> }) => {
      const res = await apiClient.patch<ApiResponse<Address>>(`/users/addresses/${id}`, patch);
      return res.data.data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/addresses/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export interface PlaceOrderPayload {
  addressId: string;
  couponCode?: string;
  paymentMethod: string;
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const res = await apiClient.post<ApiResponse<Order>>('/orders', payload);
      return res.data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export type PaymentMethod = 'card_credit' | 'card_debit' | 'upi' | 'netbanking' | 'wallet' | 'cod';

export interface InitiatePaymentPayload {
  orderId: string;
  method: PaymentMethod;
  details?: Record<string, string>;
}

export interface InitiatePaymentResult {
  paymentId: string;
  requiresOtp: boolean;
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (payload: InitiatePaymentPayload) => {
      const res = await apiClient.post<ApiResponse<InitiatePaymentResult>>('/payments/initiate', payload);
      return res.data.data!;
    },
  });
}

export interface VerifyPaymentResult {
  paymentStatus: 'pending' | 'success' | 'failed';
  orderStatus: string;
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (payload: { paymentId: string; otp?: string }) => {
      const res = await apiClient.post<ApiResponse<VerifyPaymentResult>>('/payments/verify', payload);
      return res.data.data!;
    },
  });
}
