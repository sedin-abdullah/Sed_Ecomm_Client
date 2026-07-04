import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/app/queryClient';
import { router } from '@/app/router';
import { useThemeStore } from '@/store/themeStore';
import { useCurrencyStore, LANGUAGE_CURRENCY_MAP } from '@/store/currencyStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, User } from '@/types';
import { applyDocumentDirection } from '@/i18n';
import i18n from '@/i18n';
import { Toaster } from '@/components/ui/Toaster';
import { Spinner } from '@/components/ui/Spinner';

/**
 * The access token is deliberately excluded from persisted auth state (see
 * authStore.ts), so a page reload needs to re-mint one from the httpOnly
 * refresh-token cookie before ProtectedRoute/AdminRoute can trust
 * `isAuthenticated` — otherwise a real session bounces to /login on refresh.
 */
function useAuthBootstrap(): boolean {
  const [bootstrapped, setBootstrapped] = useState(false);
  const hasPersistedUser = useAuthStore((state) => Boolean(state.user));
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!hasPersistedUser) {
      setBootstrapped(true);
      return;
    }
    apiClient
      .post<ApiResponse<{ accessToken: string; user?: User }>>('/auth/refresh-token')
      .then((res) => {
        const token = res.data.data?.accessToken;
        if (token) {
          setAccessToken(token);
          // Resync the persisted user with the account the refresh cookie
          // actually belongs to, so the UI role never diverges from the token
          // (e.g. showing the admin panel while holding a customer token).
          if (res.data.data?.user) setUser(res.data.data.user);
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setBootstrapped(true));
    // Only ever run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bootstrapped;
}

export default function App() {
  const resolved = useThemeStore((state) => state.resolved);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const fetchRates = useCurrencyStore((state) => state.fetchRates);
  const currencyHydrated = useCurrencyStore.persist.hasHydrated();
  const authBootstrapped = useAuthBootstrap();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  useEffect(() => {
    void fetchRates();
    applyDocumentDirection(i18n.language);
  }, [fetchRates]);

  // Only auto-pick a currency for the language the first time (before the
  // user has ever picked one explicitly) — once zustand-persist has
  // hydrated a previously chosen currency we leave it alone.
  useEffect(() => {
    if (!currencyHydrated) return;
    const stored = localStorage.getItem('sed-ecomm-currency');
    if (stored) return;
    const mapped = LANGUAGE_CURRENCY_MAP[i18n.language];
    if (mapped) setCurrency(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyHydrated]);

  if (!authBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
