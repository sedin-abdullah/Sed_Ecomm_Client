import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useOrder, useOrderTracking, useCancelOrder, useReturnOrder } from '@/features/orders/hooks/useOrders';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/imageFallback';
import { useProductI18n } from '@/lib/productI18n';

export function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const { data: tracking } = useOrderTracking(id);
  const cancelOrder = useCancelOrder();
  const returnOrder = useReturnOrder();
  const toast = useToast();
  const pi = useProductI18n();

  if (isLoading || !order) {
    return (
      <div className="container flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const canCancel = ['pending', 'processing'].includes(order.status);
  const canReturn = order.status === 'delivered';

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {tracking && tracking.length > 0 && (
          <Card>
            <CardBody>
              <h2 className="mb-4 text-sm font-semibold">Tracking</h2>
              <ol className="space-y-4">
                {tracking.map((event, i) => (
                  <li key={i} className="flex gap-3">
                    {i === tracking.length - 1 ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{event.label}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                      {event.note && <p className="text-xs text-muted-foreground">{event.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-sm font-semibold">Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt="" onError={handleImageError} className="size-14 rounded-lg object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{pi.rawName(item.name)}</p>
                  <p className="text-muted-foreground">Qty {item.qty}</p>
                </div>
                <PriceTag price={item.price * item.qty} size="sm" />
              </div>
            ))}
          </CardBody>
        </Card>

        <div className="flex gap-3">
          {canCancel && (
            <Button
              variant="outline"
              isLoading={cancelOrder.isPending}
              onClick={() => cancelOrder.mutate(order.id, { onSuccess: () => toast.success('Order cancelled') })}
            >
              Cancel order
            </Button>
          )}
          {canReturn && (
            <Button
              variant="outline"
              isLoading={returnOrder.isPending}
              onClick={() => returnOrder.mutate(order.id, { onSuccess: () => toast.success('Return requested') })}
            >
              Return product
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            Download invoice
          </Button>
        </div>
      </div>

      <Card className="h-fit">
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Status</h2>
            <Badge variant="brand" className={cn('capitalize')}>
              {order.status}
            </Badge>
          </div>
          <div className="space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceTag price={order.subtotal} size="sm" />
            </div>
            {!!order.discount && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{order.discount}</span>
              </div>
            )}
            {!!order.shippingFee && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <PriceTag price={order.shippingFee} size="sm" />
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <PriceTag price={order.total} />
            </div>
          </div>
          <div className="border-t border-border pt-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
