import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useReviews, useCreateReview, useLikeReview } from '@/features/reviews/hooks/useReviews';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAddToWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAuthStore } from '@/store/authStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useToast } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { RatingStars } from '@/components/ui/RatingStars';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useRelatedProducts(product?.id);
  const { data: reviews } = useReviews(product?.id);
  const createReview = useCreateReview(product?.id);
  const likeReview = useLikeReview(product?.id);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const pi = useProductI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addId);
  const toast = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="container grid gap-8 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <p className="container py-16 text-center text-muted-foreground">Product not found.</p>;
  }

  const sizes = product.variants?.sizes ?? [];
  const colors = product.variants?.colors ?? [];

  function handleAddToCart() {
    if (!isAuthenticated) {
      toast.info('Log in to add items to your cart');
      return;
    }
    addToCart.mutate(
      { productId: product!.id, variant: size || color ? { size, color } : undefined, qty },
      { onSuccess: () => toast.success('Added to cart') },
    );
  }

  function handleWishlist() {
    if (!isAuthenticated) {
      toast.info('Log in to save items to your wishlist');
      return;
    }
    addToWishlist.mutate(product!.id, {
      onSuccess: ({ alreadyExists }) =>
        alreadyExists ? toast.info('Already in your wishlist') : toast.success('Added to wishlist ❤️'),
    });
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Log in to write a review');
      return;
    }
    createReview.mutate(
      { rating: reviewRating, comment: reviewComment },
      { onSuccess: () => { setReviewComment(''); toast.success('Review submitted'); } },
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface-2">
            {product.images[activeImage] && (
              <img src={product.images[activeImage].url} alt={product.name} onError={handleImageError} className="size-full object-cover" />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'size-16 shrink-0 overflow-hidden rounded-xl border-2',
                    i === activeImage ? 'border-brand-500' : 'border-transparent',
                  )}
                >
                  <img src={img.url} alt="" onError={handleImageError} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{pi.name(product)}</h1>
          <div className="mt-2">
            <RatingStars rating={product.rating} count={product.numReviews} />
          </div>
          <div className="mt-4">
            <PriceTag
              price={product.discountPrice ?? product.price}
              compareAtPrice={product.discountPrice ? product.price : undefined}
              size="lg"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pi.description(product)}</p>

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'rounded-lg border px-3.5 py-2 text-sm font-medium',
                      size === s ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border text-foreground',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'rounded-lg border px-3.5 py-2 text-sm font-medium capitalize',
                      color === c ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border text-foreground',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={product.stock} />
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <Button size="lg" className="flex-1" disabled={product.stock === 0} isLoading={addToCart.isPending} onClick={handleAddToCart}>
              Add to cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist} aria-label="Add to wishlist">
              <Heart className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs
          items={[
            { key: 'description', label: 'Description', content: <p className="max-w-2xl text-sm text-muted-foreground">{product.description}</p> },
            {
              key: 'reviews',
              label: `Reviews (${reviews?.length ?? 0})`,
              content: (
                <div className="max-w-2xl space-y-6">
                  <form onSubmit={submitReview} className="space-y-3 rounded-2xl border border-border p-4">
                    <p className="text-sm font-semibold">Write a review</p>
                    <RatingStars rating={reviewRating} interactive onChange={setReviewRating} size={20} />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="h-24 w-full rounded-xl border border-border bg-surface p-3 text-sm"
                    />
                    <Button type="submit" isLoading={createReview.isPending}>
                      Submit review
                    </Button>
                  </form>

                  {reviews?.map((r) => (
                    <div key={r.id} className="border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{r.userName}</p>
                        <RatingStars rating={r.rating} size={14} />
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{r.comment}</p>
                      <button
                        onClick={() => likeReview.mutate(r.id)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-500"
                      >
                        <Heart className="size-3.5" /> {r.likeCount ?? 0}
                      </button>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>

      {related && related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
