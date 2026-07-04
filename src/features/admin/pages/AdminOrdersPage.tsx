import { useAdminOrders, useUpdateOrderStatus } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/store/toastStore';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function paymentBadgeVariant(status?: string): 'neutral' | 'success' | 'warning' | 'danger' {
  if (status === 'success') return 'success';
  if (status === 'failed') return 'danger';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders?.length ?? 0} order{orders?.length === 1 ? '' : 's'}
        </p>
      </div>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Payment</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : orders?.length === 0 ? (
                <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No orders yet</td></tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 align-top">
                    <td className="py-3 pr-4 font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-foreground">
                        {order.user?.name ?? 'Guest'}
                      </div>
                      {order.user?.email && (
                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {order.items?.length ?? 0}
                    </td>
                    <td className="py-3 pr-4">
                      <PriceTag price={order.total} size="sm" />
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus ?? 'pending'}
                      </Badge>
                      <div className="mt-1 text-xs text-muted-foreground uppercase">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="py-3">
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate(
                            { id: order.id, status: e.target.value },
                            { onSuccess: () => toast.success('Order status updated') },
                          )
                        }
                        className="w-36"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
