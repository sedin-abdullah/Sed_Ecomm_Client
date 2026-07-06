import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts, useProductFacets } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { useProductI18n } from '@/lib/productI18n';
import type { ProductFilters, SortOption } from '@/types';

function FilterPanel({
  filters,
  setFilters,
}: {
  filters: ProductFilters;
  setFilters: (f: ProductFilters) => void;
}) {
  const { data: categories } = useCategories();
  const { data: facets } = useProductFacets();
  const pi = useProductI18n();

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border text-muted-foreground'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilters({ ...filters, category: filters.category === c.slug ? undefined : c.slug })}
              className={pill(filters.category === c.slug)}
            >
              {pi.category(c.name)}
            </button>
          ))}
        </div>
      </div>

      {!!facets?.brands.length && (
        <div>
          <p className="mb-2 text-sm font-semibold">Brand</p>
          <Select
            value={filters.brand ?? ''}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value || undefined })}
          >
            <option value="">All brands</option>
            {facets.brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold">Price range (USD)</p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {!!facets?.sizes.length && (
        <div>
          <p className="mb-2 text-sm font-semibold">Size</p>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setFilters({ ...filters, size: filters.size === s ? undefined : s })}
                className={pill(filters.size === s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!!facets?.colors.length && (
        <div>
          <p className="mb-2 text-sm font-semibold">Color</p>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => (
              <button
                key={c}
                onClick={() => setFilters({ ...filters, color: filters.color === c ? undefined : c })}
                className={pill(filters.color === c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold">Minimum rating</p>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: filters.rating === r ? undefined : r })}
              className={pill(filters.rating === r)}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Availability</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ ...filters, inStock: filters.inStock ? undefined : true })}
            className={pill(Boolean(filters.inStock))}
          >
            In stock only
          </button>
          <button
            onClick={() => setFilters({ ...filters, onSale: filters.onSale ? undefined : true })}
            className={pill(Boolean(filters.onSale))}
          >
            On sale
          </button>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => setFilters({})}>
        Clear filters
      </Button>
    </div>
  );
}

export function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const num = (key: string) => {
      const v = searchParams.get(key);
      return v !== null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined;
    };
    const bool = (key: string) => {
      const v = searchParams.get(key);
      return v === '1' || v === 'true' ? true : undefined;
    };
    return {
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sort: (searchParams.get('sort') as SortOption | null) ?? undefined,
      brand: searchParams.get('brand') ?? undefined,
      size: searchParams.get('size') ?? undefined,
      color: searchParams.get('color') ?? undefined,
      minPrice: num('minPrice'),
      maxPrice: num('maxPrice'),
      rating: num('rating'),
      inStock: bool('inStock'),
      onSale: bool('onSale'),
      flashSale: bool('flashSale'),
    };
  });

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(filters);
  const products = useMemo(() => data?.pages.flatMap((p) => p.data ?? []) ?? [], [data]);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {filters.search ? `Results for "${filters.search}"` : 'Shop all products'}
        </h1>
        <div className="flex items-center gap-2">
          <Select
            value={filters.sort ?? ''}
            onChange={(e) => setFilters({ ...filters, sort: (e.target.value || undefined) as SortOption | undefined })}
            className="w-44"
          >
            <option value="">Sort by</option>
            <option value="newest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popularity</option>
            <option value="rating">Rating</option>
          </Select>
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Filters">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </Drawer>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <RevealItem key={p.id}>
                  <ProductCard product={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}

          {!isLoading && products.length === 0 && isError && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-muted-foreground">
                Couldn't reach the server — it may be waking up. This can take up to a minute.
              </p>
              <Button variant="outline" onClick={() => refetch()}>Try again</Button>
            </div>
          )}

          {!isLoading && products.length === 0 && !isError && (
            <p className="py-16 text-center text-muted-foreground">No products match these filters.</p>
          )}

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
