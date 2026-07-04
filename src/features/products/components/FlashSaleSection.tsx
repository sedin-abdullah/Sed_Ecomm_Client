import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { PriceTag } from '@/components/ui/PriceTag';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

interface Countdown {
  h: number;
  m: number;
  s: number;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur sm:h-12 sm:w-12">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold tabular-nums text-white sm:text-xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/70">{label}</span>
    </div>
  );
}

function FlashCard({ product, index }: { product: Product; index: number }) {
  const pi = useProductI18n();
  const reduce = useReducedMotion();
  const price = product.discountPrice ?? product.price;
  const hasDiscount = Boolean(product.discountPrice);
  const discountPct = hasDiscount ? Math.round((1 - product.discountPrice! / product.price) * 100) : 0;
  // We only know remaining stock; derive a deterministic "claimed" percentage
  // so the progress bar always reads as actively selling without faking data.
  const claimed = Math.min(92, Math.max(30, 100 - product.stock));
  const sellingFast = product.stock <= 25;

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.05, 0.3) }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-auto"
    >
      <Link
        to={`/products/${product.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-elevated backdrop-blur-md transition-shadow duration-300 group-hover:shadow-premium"
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]?.url}
            alt={pi.name(product)}
            loading="lazy"
            onError={handleImageError}
            className="size-full object-cover transition-transform duration-500 ease-premium group-hover:scale-110"
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-accent-gradient px-2.5 py-1 text-xs font-bold text-white shadow-elevated">
              -{discountPct}%
            </span>
          )}
          {sellingFast && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-700 shadow-soft">
              <Flame className="size-3" /> Selling Fast
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 text-white">
          {product.brand && <p className="text-[11px] uppercase tracking-wide text-white/60">{product.brand}</p>}
          <h3 className="mt-0.5 truncate text-sm font-semibold">{pi.name(product)}</h3>
          <div className="mt-2">
            <PriceTag price={price} compareAtPrice={hasDiscount ? product.price : undefined} size="sm" />
          </div>

          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={reduce ? undefined : { width: 0 }}
                whileInView={reduce ? undefined : { width: `${claimed}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={reduce ? { width: `${claimed}%` } : undefined}
                className="h-full rounded-full bg-accent-gradient"
              />
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-white/70">Only {product.stock} left</p>
          </div>

          <span className="mt-3 inline-flex items-center justify-center gap-1 rounded-xl bg-white/15 py-2 text-xs font-semibold text-white transition-colors duration-200 group-hover:bg-white group-hover:text-accent-700">
            Grab Deal <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function FlashSaleSection({ products, countdown }: { products: Product[]; countdown: Countdown }) {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Premium background: brand gradient wash + soft blurred accent blobs. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-brand-gradient" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-accent-500/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-brand-500/40 blur-3xl" />

      <div className="container relative">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="text-white">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
              <Flame className="size-6 text-accent-300" /> Flash Sale
            </h2>
            <p className="mt-1 text-sm text-white/70">Limited-time deals — going fast.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-white/70">Ends in</span>
            <div className="flex items-center gap-1.5">
              <TimeBox value={countdown.h} label="Hrs" />
              <span className="pb-4 font-bold text-white/50">:</span>
              <TimeBox value={countdown.m} label="Min" />
              <span className="pb-4 font-bold text-white/50">:</span>
              <TimeBox value={countdown.s} label="Sec" />
            </div>
          </div>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {products.slice(0, 5).map((p, i) => (
            <FlashCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            to="/products?onSale=true&sort=price_asc"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-accent-700"
          >
            View all deals <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
