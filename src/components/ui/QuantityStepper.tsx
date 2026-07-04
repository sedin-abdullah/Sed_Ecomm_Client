import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, className, disabled }: QuantityStepperProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center rounded-xl border border-border bg-surface',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        className="flex h-full w-9 items-center justify-center text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        className="flex h-full w-9 items-center justify-center text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
