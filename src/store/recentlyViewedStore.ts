import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  ids: string[];
  addId: (id: string) => void;
}

/** Tracks recently-viewed product ids (most recent first) for the Home page rail. */
export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      addId: (id) => {
        const rest = get().ids.filter((existing) => existing !== id);
        set({ ids: [id, ...rest].slice(0, MAX_ITEMS) });
      },
    }),
    { name: 'sed-ecomm-recently-viewed' },
  ),
);
