import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

/** Read-only (default) or interactive 5-star rating display. */
export function RatingStars({ rating, count, size = 16, className, interactive = false, onChange }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center" role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of 5 stars`}>
        {stars.map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(star)}
              className={cn(!interactive && 'pointer-events-none', 'p-0.5')}
              aria-label={interactive ? `Rate ${star} stars` : undefined}
            >
              <Star
                width={size}
                height={size}
                className={filled ? 'fill-gold-500 text-gold-500' : 'fill-none text-muted-foreground/50'}
              />
            </button>
          );
        })}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
