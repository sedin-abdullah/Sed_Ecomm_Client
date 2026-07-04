import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/store/toastStore';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

export function WishlistPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: products, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const toast = useToast();
  const pi = useProductI18n();

  function moveToCart(productId: string) {
    addToCart.mutate(
      { productId, qty: 1 },
      {
        onSuccess: () => {
          removeFromWishlist.mutate(productId);
          toast.success('Moved to cart');
        },
        onError: () => toast.error('Could not add to cart'),
      },
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-24 text-center">
        <p className="text-lg font-medium text-foreground">Log in to view your wishlist</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Wishlist</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button className="mt-4" onClick={() => navigate('/products')}>
            Discover products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const outOfStock = product.stock <= 0;
            return (
              <Card key={product.id}>
                <CardBody className="flex gap-4">
                  <Link to={`/products/${product.slug}`} className="shrink-0">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      onError={handleImageError}
                      className="size-24 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link to={`/products/${product.slug}`} className="truncate text-sm font-medium hover:underline">
                      {pi.name(product)}
                    </Link>
                    <div className="mt-1">
                      <RatingStars rating={product.rating} count={product.numReviews} size={13} />
                    </div>
                    <div className="mt-1">
                      <PriceTag
                        price={product.discountPrice ?? product.price}
                        compareAtPrice={product.discountPrice ? product.price : undefined}
                        size="sm"
                      />
                    </div>
                    <p className={`mt-1 text-xs font-medium ${outOfStock ? 'text-danger' : 'text-success'}`}>
                      {outOfStock ? 'Out of stock' : 'In stock'}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={outOfStock}
                        isLoading={addToCart.isPending}
                        onClick={() => moveToCart(product.id)}
                      >
                        <ShoppingCart className="mr-1.5 size-3.5" /> Move to cart
                      </Button>
                      <button
                        onClick={() =>
                          removeFromWishlist.mutate(product.id, { onSuccess: () => toast.success('Removed from wishlist') })
                        }
                        className="rounded-lg p-2 text-danger hover:bg-surface-2"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
