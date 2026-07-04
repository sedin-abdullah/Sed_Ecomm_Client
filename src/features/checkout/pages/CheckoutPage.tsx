import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAddresses, useAddAddress, usePlaceOrder } from '@/features/checkout/hooks/useCheckout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PriceTag } from '@/components/ui/PriceTag';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/store/toastStore';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(2),
  country: z.string().min(2),
});
type AddressForm = z.infer<typeof addressSchema>;

export function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const addAddress = useAddAddress();
  const placeOrder = usePlaceOrder();
  const pi = useProductI18n();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [showNewAddress, setShowNewAddress] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  function onAddAddress(values: AddressForm) {
    addAddress.mutate(values, {
      onSuccess: (address) => {
        setSelectedAddressId(address.id);
        setShowNewAddress(false);
        reset();
      },
    });
  }

  function handleContinue() {
    if (!selectedAddressId) {
      toast.error('Select or add a shipping address');
      return;
    }
    navigate('/payment', { state: { addressId: selectedAddressId, couponCode: cart?.couponCode } });
  }

  if (cartLoading || addressesLoading) {
    return (
      <div className="container flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

        <Card>
          <CardBody className="space-y-3">
            <h2 className="text-sm font-semibold">Shipping address</h2>
            {addresses?.map((address) => (
              <label
                key={address.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                />
                <div className="text-sm">
                  <p className="font-medium">{address.fullName} · {address.phone}</p>
                  <p className="text-muted-foreground">
                    {address.line1}, {address.line2 ? `${address.line2}, ` : ''}
                    {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
              </label>
            ))}

            {!showNewAddress ? (
              <Button variant="outline" onClick={() => setShowNewAddress(true)}>
                + Add new address
              </Button>
            ) : (
              <form onSubmit={handleSubmit(onAddAddress)} className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4">
                <Input label="Full name" error={errors.fullName?.message} className="col-span-2" {...register('fullName')} />
                <Input label="Phone" error={errors.phone?.message} className="col-span-2" {...register('phone')} />
                <Input label="Address line 1" error={errors.line1?.message} className="col-span-2" {...register('line1')} />
                <Input label="Address line 2 (optional)" className="col-span-2" {...register('line2')} />
                <Input label="City" error={errors.city?.message} {...register('city')} />
                <Input label="State" error={errors.state?.message} {...register('state')} />
                <Input label="Postal code" error={errors.postalCode?.message} {...register('postalCode')} />
                <Input label="Country" error={errors.country?.message} {...register('country')} />
                <div className="col-span-2 flex gap-2">
                  <Button type="submit" isLoading={addAddress.isPending}>
                    Save address
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowNewAddress(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {cart?.items.filter((i) => !i.savedForLater).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.product.images[0]?.url} alt="" onError={handleImageError} className="size-12 rounded-lg object-cover" />
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{pi.name(item.product)}</p>
                  <p className="text-muted-foreground">Qty {item.qty}</p>
                </div>
                <PriceTag price={item.product.price * item.qty} size="sm" />
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceTag price={cart?.subtotal ?? 0} size="sm" />
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <PriceTag price={cart?.total ?? 0} />
            </div>
          </div>
          <Button size="lg" className="w-full" isLoading={placeOrder.isPending} onClick={handleContinue}>
            Continue to payment
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
