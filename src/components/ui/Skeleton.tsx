import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton-shimmer rounded-lg', className)} {...props} />;
}

/** Skeleton for a product card in a grid or horizontal rail. */
export function ProductCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-2 h-4 w-1/3" />
    </div>
  );
}
