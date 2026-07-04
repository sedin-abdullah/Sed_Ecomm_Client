import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, BookmarkPlus, Heart } from 'lucide-react';
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useToggleSaveForLater,
  useApplyCoupon,
  useRemoveCoupon,
} from '@/features/cart/hooks/useCart';
import { useAddToWishlist } from '@/features/wishlist/hooks/useWishlist';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PriceTag } from '@/components/ui/PriceTag';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/store/toastStore';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

export function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const toggleSave = useToggleSaveForLater();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const addToWishlist = useAddToWishlist();
  const pi = useProductI18n();
  const toast = useToast();

  function moveToWishlist(itemId: string, productId: string) {
    addToWishlist.mutate(productId, {
      onSuccess: () => {
        removeItem.mutate(itemId);
        toast.success('Moved to wishlist');
      },
    });
  }
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');

  if (isLoading) {
    return (
      <div className="container flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeItems = cart?.items.filter((i) => !i.savedForLater) ?? [];
  const savedItems = cart?.items.filter((i) => i.savedForLater) ?? [];

  if (!cart || activeItems.length === 0) {
    return (
      <div className="container py-24 text-center">
        <p className="text-lg font-medium text-foreground">Your cart is empty</p>
        <Button className="mt-4" onClick={() => navigate('/products')}>
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
        {activeItems.map((item) => (
          <Card key={item.id}>
            <CardBody className="flex gap-4">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                onError={handleImageError}
                className="size-24 shrink-0 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/products/${item.product.slug}`} className="font-medium text-foreground hover:underline">
                      {pi.name(item.product)}
                    </Link>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant.size} / {item.variant.color}</p>}
                  </div>
                  <PriceTag price={(item.product.discountPrice ?? item.product.price) * item.qty} size="sm" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <QuantityStepper
                    value={item.qty}
                    onChange={(qty) =>
                      updateItem.mutate({ itemId: item.id, qty }, { onSuccess: () => toast.success('Quantity updated') })
                    }
                  />
                  <button
                    onClick={() => moveToWishlist(item.id, item.product.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Heart className="size-3.5" /> Move to wishlist
                  </button>
                  <button
                    onClick={() => toggleSave.mutate(item.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <BookmarkPlus className="size-3.5" /> Save for later
                  </button>
                  <button
                    onClick={() => removeItem.mutate(item.id, { onSuccess: () => toast.success('Removed from cart') })}
                    className="flex items-center gap-1 text-xs text-danger hover:underline"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {savedItems.length > 0 && (
          <div className="pt-4">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Saved for later</h2>
            <div className="space-y-3">
              {savedItems.map((item) => (
                <Card key={item.id}>
                  <CardBody className="flex items-center gap-4">
                    <img src={item.product.images[0]?.url} alt="" onError={handleImageError} className="size-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pi.name(item.product)}</p>
                      <PriceTag price={item.product.price} size="sm" />
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toggleSave.mutate(item.id)}>
                      Move to cart
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Card className="h-fit">
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex gap-2">
            <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <Button
              variant="outline"
              isLoading={applyCoupon.isPending}
              onClick={() =>
                applyCoupon.mutate(coupon, {
                  onSuccess: () => toast.success('Coupon applied'),
                  onError: () => toast.error('Invalid or expired coupon'),
                })
              }
            >
              Apply
            </Button>
          </div>
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceTag price={cart.subtotal} size="sm" />
            </div>
            {!!cart.discount && (
              <div className="flex justify-between text-success">
                <span>Discount {cart.couponCode ? `(${cart.couponCode})` : ''}</span>
                <span className="flex items-center gap-2">
                  -{cart.discount}
                  <button
                    onClick={() => removeCoupon.mutate(undefined, { onSuccess: () => toast.success('Coupon removed') })}
                    className="text-xs font-normal text-muted-foreground underline hover:text-foreground"
                  >
                    Remove
                  </button>
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <PriceTag price={cart.tax ?? 0} size="sm" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              {cart.shippingFee ? <PriceTag price={cart.shippingFee} size="sm" /> : <span className="text-success">Free</span>}
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Grand Total</span>
              <PriceTag price={cart.total} />
            </div>
          </div>
          <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
