import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  /** What the user picked (or 'system' if left on default). Persisted. */
  preference: ThemePreference;
  /** The actual light/dark value currently applied to the document. */
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return preference;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // The premium design is dark-first; default new visitors to dark while
      // still honouring a previously-persisted light/system preference.
      preference: 'dark',
      resolved: resolve('dark'),
      setPreference: (preference) => set({ preference, resolved: resolve(preference) }),
      toggle: () => {
        const next: ThemePreference = get().resolved === 'dark' ? 'light' : 'dark';
        set({ preference: next, resolved: resolve(next) });
      },
    }),
    {
      name: 'sed-ecomm-theme',
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => (state) => {
        // Re-resolve against the current system preference right after
        // localStorage hydration in case 'system' was stored.
        state?.setPreference(state.preference);
      },
    },
  ),
);
