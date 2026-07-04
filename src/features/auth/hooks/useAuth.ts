import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, AuthResponse, User } from '@/types';

// The /auth/me and /users/me endpoints both wrap the user under a `user` key.
type UserEnvelope = { user: User };

export function useMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<UserEnvelope>>('/auth/me');
      const user = res.data.data?.user ?? null;
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await apiClient.patch<ApiResponse<UserEnvelope>>('/users/me', payload);
      return res.data.data!.user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
      return res.data.data!;
    },
    onSuccess: (data) => login(data.user, data.accessToken),
  });
}

export function useRegister() {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string }) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      return res.data.data!;
    },
    onSuccess: (data) => login(data.user, data.accessToken),
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSettled: () => logout(),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
      return res.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const res = await apiClient.post<ApiResponse>(`/auth/reset-password/${token}`, { password });
      return res.data;
    },
  });
}
