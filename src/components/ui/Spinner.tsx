import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'size-4', md: 'size-6', lg: 'size-10' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-brand-500', sizeClasses[size], className)}
    />
  );
}
