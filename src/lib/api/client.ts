import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse } from '@/types';
import type { AuthResponse } from '@/types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  // The refresh token is delivered as an httpOnly cookie by the API, so
  // credentials must be included for /auth/refresh-token (and any other
  // cookie-dependent call) to work.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the in-memory access token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  // For file uploads the body is FormData: drop the default JSON Content-Type
  // so the browser sets `multipart/form-data` with the correct boundary.
  // Without this, multer receives an unparseable body and the request fails.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Coalesce concurrent 401s into a single in-flight refresh request so a
// burst of parallel calls doesn't fire /auth/refresh-token multiple times.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<AuthResponse>>(
        `${baseURL}/auth/refresh-token`,
        {},
        { withCredentials: true },
      )
      .then((res) => res.data.data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(originalRequest);
      }

      // Refresh failed — force logout so protected UI reacts accordingly.
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
