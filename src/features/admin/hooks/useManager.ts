import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

/** Returned once on creation — includes the plaintext password to copy/share. */
export interface CreatedAdmin {
  id: string;
  name: string;
  email: string;
  password: string;
}

export function useAdmins() {
  return useQuery({
    queryKey: ['manager', 'admins'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<AdminAccount[]>>('/manager/admins');
      return res.data.data ?? [];
    },
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name?: string) => {
      const res = await apiClient.post<ApiResponse<CreatedAdmin>>('/manager/admins', name ? { name } : {});
      return res.data.data!;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', 'admins'] }),
  });
}

export function useSetAdminStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await apiClient.patch(`/manager/admins/${id}/status`, { isActive });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', 'admins'] }),
  });
}

// ---- Approval workflow ----

export type ChangeStatus = 'pending' | 'approved' | 'rejected';

export interface ChangeRequest {
  id: string;
  actorName: string;
  module: 'product' | 'category' | 'coupon' | 'order';
  action: 'create' | 'update' | 'delete' | 'status';
  targetId?: string;
  targetLabel?: string;
  payload?: Record<string, unknown>;
  before?: Record<string, unknown>;
  status: ChangeStatus;
  reviewerName?: string;
  reviewedAt?: string;
  note?: string;
  createdAt: string;
}

export function useChangeRequests(status?: ChangeStatus) {
  return useQuery({
    queryKey: ['manager', 'change-requests', status ?? 'all'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ChangeRequest[]>>('/manager/change-requests', {
        params: status ? { status } : undefined,
      });
      return res.data.data ?? [];
    },
    // Near-real-time notifications of admin actions awaiting review.
    refetchInterval: status === 'pending' ? 15_000 : false,
  });
}

export function useApproveChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/manager/change-requests/${id}/approve`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', 'change-requests'] }),
  });
}

export function useRejectChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note?: string }) => {
      await apiClient.post(`/manager/change-requests/${id}/reject`, note ? { note } : {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', 'change-requests'] }),
  });
}
