import { cn } from '@/lib/utils';
import { useCurrencyStore, formatPrice } from '@/store/currencyStore';

export interface PriceTagProps {
  /** Base price in USD, per API contract. */
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

/** Renders a currency-converted price with an optional strike-through compare-at price and discount badge. */
export function PriceTag({ price, compareAtPrice, size = 'md', className }: PriceTagProps) {
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);

  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / compareAtPrice!) * 100) : 0;

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-foreground', sizeClasses[size])}>
        {formatPrice(price, currency, rates)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(compareAtPrice!, currency, rates)}
          </span>
          <span className="text-xs font-semibold text-success">{discountPct}% off</span>
        </>
      )}
    </span>
  );
}
