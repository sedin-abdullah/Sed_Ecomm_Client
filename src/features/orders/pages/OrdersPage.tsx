import { Link } from 'react-router-dom';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { Spinner } from '@/components/ui/Spinner';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'neutral',
};

export function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="container flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">My Orders</h1>
      {!orders || orders.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <Card interactive>
                <CardBody className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'neutral'}>{order.status}</Badge>
                  <PriceTag price={order.total} size="sm" />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
