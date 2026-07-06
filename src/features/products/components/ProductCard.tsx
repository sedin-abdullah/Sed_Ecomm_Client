import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { PriceTag } from '@/components/ui/PriceTag';
import { RatingStars } from '@/components/ui/RatingStars';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { useAuthStore } from '@/store/authStore';
import { useAddToWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useToast } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToWishlist = useAddToWishlist();
  const toast = useToast();
  const pi = useProductI18n();
  const [liked, setLiked] = useState(false);
  const image = product.images?.[0];

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Log in to save items to your wishlist');
      return;
    }
    setLiked(true);
    addToWishlist.mutate(product.id, {
      onSuccess: ({ alreadyExists }) =>
        alreadyExists ? toast.info('Already in your wishlist') : toast.success('Added to wishlist ❤️'),
    });
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className={className}>
      <Card interactive data-testid="product-card" data-product-slug={product.slug} className="group relative overflow-hidden">
        <Link to={`/products/${product.slug}`} data-testid="product-link">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-surface-2">
            {image && (
              <img
                src={image.url}
                alt={image.alt ?? product.name}
                loading="lazy"
                onError={handleImageError}
                className="size-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
              />
            )}
            {product.isNewArrival && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                New
              </span>
            )}
            <motion.button
              type="button"
              data-testid="wishlist-toggle"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              whileTap={{ scale: 0.8 }}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-soft backdrop-blur transition-transform hover:scale-105"
            >
              <motion.span
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Heart className={cn('size-4 transition-colors', liked && 'fill-accent-500 text-accent-500')} />
              </motion.span>
              <AnimatePresence>
                {liked && (
                  <motion.span
                    key="burst"
                    aria-hidden
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-accent-500/30"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <div className="p-4">
            {product.brand && <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
            <h3 data-testid="product-name" className="mt-1 truncate text-sm font-medium text-foreground">{pi.name(product)}</h3>
            <div className="mt-1.5">
              <RatingStars rating={product.rating} count={product.numReviews} size={13} />
            </div>
            <div className="mt-2">
              <PriceTag
                price={product.discountPrice ?? product.price}
                compareAtPrice={product.discountPrice ? product.price : undefined}
                size="sm"
              />
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}

export function ProductRow({ title, products, viewAllHref }: { title: string; products: Product[]; viewAllHref?: string }) {
  return (
    <section className="container py-8">
      <Reveal variant="up" className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
        {viewAllHref && (
          <Link to={viewAllHref} className="text-sm font-medium text-brand-500 hover:underline">
            View all
          </Link>
        )}
      </Reveal>
      <RevealGroup
        className={cn('flex gap-4 overflow-x-auto pb-2', '[&>*]:w-[44%] [&>*]:shrink-0 sm:[&>*]:w-[30%] lg:[&>*]:w-[18%]')}
      >
        {products.map((p) => (
          <RevealItem key={p.id}>
            <ProductCard product={p} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
