import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-elevated hover:shadow-glow hover:brightness-[1.06] active:brightness-95',
  secondary:
    'bg-surface-2 text-foreground border border-border shadow-soft hover:bg-muted',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-surface-2',
  ghost: 'bg-transparent text-foreground hover:bg-surface-2',
  danger: 'bg-danger text-white shadow-elevated hover:brightness-105',
  link: 'bg-transparent text-brand-500 underline-offset-4 hover:underline p-0 h-auto',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-xl',
  icon: 'h-11 w-11 rounded-xl',
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Core action primitive for the design system. Ripple-on-click is purely a
 * CSS/Framer Motion micro-interaction (no external ripple library), applied
 * as a restrained accent — not a heavy visual effect.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const id = Date.now();
      setRipples((prev) => [
        ...prev,
        { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size },
      ]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
      onClick?.(event);
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: variant === 'link' ? 1 : 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        onClick={handleClick}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden font-medium',
          'transition-colors duration-200 ease-premium',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white/40 animate-ripple"
            style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
          />
        ))}
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
