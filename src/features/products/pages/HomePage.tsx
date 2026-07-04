import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { ProductRow } from '@/features/products/components/ProductCard';
import {
  useBestSellers,
  useFlashSaleProducts,
  useNewArrivals,
  useRecommendedProducts,
  useRecentlyViewedProducts,
  useTrendingProducts,
  getFlashSaleEndsAt,
} from '@/features/products/hooks/useHomeSections';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Float } from '@/components/ui/Float';
import { Magnetic } from '@/components/ui/Magnetic';
import { FlashSaleSection } from '@/features/products/components/FlashSaleSection';
import { useProductI18n } from '@/lib/productI18n';

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamped = Math.max(0, remaining);
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  return { h, m, s };
}

function SkeletonRow() {
  return (
    <div className="container py-8">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-surface-2" />
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[44%] shrink-0 sm:w-[30%] lg:w-[18%]">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const trending = useTrendingProducts();
  const flashSale = useFlashSaleProducts();
  const newArrivals = useNewArrivals();
  const recommended = useRecommendedProducts();
  const bestSellers = useBestSellers();
  const { data: categories } = useCategories();
  const recentlyViewedIds = useRecentlyViewedStore((state) => state.ids);
  const recentlyViewed = useRecentlyViewedProducts(recentlyViewedIds);
  const countdown = useCountdown(getFlashSaleEndsAt());
  const pi = useProductI18n();

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-gradient">
        {/* Floating decorative accents — subtle, GPU-only, behind the content. */}
        <Float className="pointer-events-none absolute -right-10 top-8 hidden sm:block" distance={14} duration={6}>
          <div aria-hidden className="size-56 rounded-full bg-accent-500/25 blur-3xl" />
        </Float>
        <Float className="pointer-events-none absolute left-1/3 bottom-0 hidden sm:block" distance={10} duration={7} delay={1}>
          <div aria-hidden className="size-40 rounded-full bg-white/10 blur-3xl" />
        </Float>
        <div className="container relative flex min-h-[440px] flex-col items-start justify-center gap-5 py-16 text-white sm:min-h-[520px]">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur"
          >
            {t('app.tagline')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            {t('app.name')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-lg text-base text-white/85 sm:text-lg"
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Magnetic>
              <Button size="lg" onClick={() => (window.location.href = '/products')}>
                {t('common.view_all')}
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="container py-8">
          <Reveal variant="up">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">{t('nav.categories')}</h2>
          </Reveal>
          <RevealGroup className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((c) => (
              <RevealItem key={c.id}>
                <Link
                  to={`/products?category=${c.slug}`}
                  className="flex shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-4 text-center shadow-soft transition-transform duration-300 ease-premium hover:-translate-y-1 hover:shadow-elevated"
                >
                  {c.image && <img src={c.image} alt="" className="size-12 rounded-full object-cover" />}
                  <span className="text-sm font-medium">{pi.category(c.name)}</span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {flashSale.isLoading ? (
        <SkeletonRow />
      ) : (
        flashSale.data &&
        flashSale.data.length > 0 && <FlashSaleSection products={flashSale.data} countdown={countdown} />
      )}
      {trending.isLoading ? <SkeletonRow /> : trending.data && trending.data.length > 0 && (
        <ProductRow title="Trending Now" products={trending.data} viewAllHref="/products?sort=popular" />
      )}
      {newArrivals.isLoading ? <SkeletonRow /> : newArrivals.data && newArrivals.data.length > 0 && (
        <ProductRow title={t('home.title') === 'home.title' ? 'New Arrivals' : 'New Arrivals'} products={newArrivals.data} viewAllHref="/products?sort=newest" />
      )}
      {recommended.isLoading ? <SkeletonRow /> : recommended.data && recommended.data.length > 0 && (
        <ProductRow title="Recommended for You" products={recommended.data} viewAllHref="/products?sort=rating" />
      )}
      {bestSellers.isLoading ? <SkeletonRow /> : bestSellers.data && bestSellers.data.length > 0 && (
        <ProductRow title="Best Sellers" products={bestSellers.data} viewAllHref="/products?sort=popular" />
      )}
      {recentlyViewed.data && recentlyViewed.data.length > 0 && (
        <ProductRow title="Recently Viewed" products={recentlyViewed.data} />
      )}
    </div>
  );
}
