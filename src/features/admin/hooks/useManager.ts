import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';

// Which staff collection to manage. 'store-owners' (manager+) or 'managers' (superadmin).
export type StaffKind = 'store-owners' | 'managers';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

/** Returned once on creation — includes the plaintext password to copy/share. */
export interface CreatedStaff {
  id: string;
  name: string;
  email: string;
  password: string;
}

export function useStaff(kind: StaffKind) {
  return useQuery({
    queryKey: ['manager', kind],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<StaffAccount[]>>(`/manager/${kind}`);
      return res.data.data ?? [];
    },
  });
}

export function useCreateStaff(kind: StaffKind) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name?: string) => {
      const res = await apiClient.post<ApiResponse<CreatedStaff>>(`/manager/${kind}`, name ? { name } : {});
      return res.data.data!;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', kind] }),
  });
}

export function useSetStaffStatus(kind: StaffKind) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await apiClient.patch(`/manager/${kind}/${id}/status`, { isActive });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manager', kind] }),
  });
}

// ---- Activity log (fraud monitoring, monitor-only model) ----

export interface FieldChange {
  field: string;
  from?: unknown;
  to?: unknown;
}

export interface ActivityEntry {
  id: string;
  actorName: string;
  actorRole?: string;
  module: 'product' | 'category' | 'coupon' | 'order';
  action: 'create' | 'update' | 'delete' | 'status';
  targetId?: string;
  targetLabel?: string;
  summary?: string;
  changes?: FieldChange[];
  payload?: Record<string, unknown>;
  before?: Record<string, unknown>;
  createdAt: string;
}

/** Recent admin/manager actions. Pass role='admin' to focus fraud review. */
export function useActivity(role?: 'admin') {
  return useQuery({
    queryKey: ['manager', 'activity', role ?? 'all'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ActivityEntry[]>>('/manager/activity', {
        params: role ? { role } : undefined,
      });
      return res.data.data ?? [];
    },
    refetchInterval: 15_000, // near-real-time monitoring
  });
}
