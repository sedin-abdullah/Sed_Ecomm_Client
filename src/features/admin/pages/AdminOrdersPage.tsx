import { useAdminOrders, useUpdateOrderStatus } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { PriceTag } from '@/components/ui/PriceTag';
import { useToast } from '@/store/toastStore';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Order</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3">#{order.id.slice(-8).toUpperCase()}</td>
                    <td><PriceTag price={order.total} size="sm" /></td>
                    <td>
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate(
                            { id: order.id, status: e.target.value },
                            { onSuccess: () => toast.success('Order status updated') },
                          )
                        }
                        className="w-40"
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
