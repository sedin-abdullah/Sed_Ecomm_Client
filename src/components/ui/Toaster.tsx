import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect } from 'react';
import { useToastStore, type Toast, type ToastVariant } from '@/store/toastStore';
import { Portal } from '@/components/ui/Portal';
import { cn } from '@/lib/utils';

const variantIcon: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: TriangleAlert,
};

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-success/30 text-success',
  error: 'border-danger/30 text-danger',
  info: 'border-info/30 text-info',
  warning: 'border-warning/30 text-warning',
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const Icon = variantIcon[toast.variant];

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 64, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface p-4 shadow-elevated',
        variantClasses[toast.variant],
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-semibold text-foreground">{toast.title}</p>}
        <p className="text-sm text-muted-foreground">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}

/** Global toast host — mount once near the app root. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <Portal containerId="toast-root">
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </Portal>
  );
}
