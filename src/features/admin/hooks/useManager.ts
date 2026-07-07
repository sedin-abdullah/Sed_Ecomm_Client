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
