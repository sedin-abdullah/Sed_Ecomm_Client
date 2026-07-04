import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * Global auth store. Persisted to localStorage, but the access token is
 * deliberately excluded from the persisted payload (short-lived JWT kept
 * in memory only) — on reload, `lib/api/client.ts` relies on the
 * refresh-token cookie flow to re-hydrate a fresh access token via
 * `/auth/refresh-token` before the user is considered logged in again.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: Boolean(accessToken) }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'sed-ecomm-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
