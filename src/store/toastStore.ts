import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id' | 'duration'> & { id?: string; duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => {
    const id = toast.id ?? crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { duration: DEFAULT_DURATION, ...toast, id }],
    }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/**
 * Convenience hook for later stages: `useToast().success('Item added')`.
 * Kept separate from the store so components don't need to know the
 * store's internal shape.
 */
export function useToast() {
  const push = useToastStore((state) => state.push);
  const dismiss = useToastStore((state) => state.dismiss);

  return {
    success: (message: string, title?: string) => push({ message, title, variant: 'success', duration: DEFAULT_DURATION }),
    error: (message: string, title?: string) => push({ message, title, variant: 'error', duration: DEFAULT_DURATION }),
    info: (message: string, title?: string) => push({ message, title, variant: 'info', duration: DEFAULT_DURATION }),
    warning: (message: string, title?: string) => push({ message, title, variant: 'warning', duration: DEFAULT_DURATION }),
    dismiss,
  };
}
