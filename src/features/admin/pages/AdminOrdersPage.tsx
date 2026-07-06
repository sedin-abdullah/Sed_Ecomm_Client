import { Fragment, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { PriceTag } from '@/components/ui/PriceTag';
import { useToast } from '@/store/toastStore';
import type { Order } from '@/types';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Payment</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : !orders?.length ? (
                <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No orders yet.</td></tr>
              ) : (
                orders.map((order: Order) => {
                  const itemCount = order.items.reduce((n, it) => n + it.qty, 0);
                  const isOpen = expanded === order.id;
                  return (
                    <Fragment key={order.id}>
                      <tr className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="py-3 pr-4">
                          <div className="font-medium">{order.user?.name ?? '—'}</div>
                          {order.user?.email && <div className="text-xs text-muted-foreground">{order.user.email}</div>}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">{formatDate(order.createdAt)}</td>
                        <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">{itemCount} item{itemCount === 1 ? '' : 's'}</td>
                        <td className="py-3 pr-4 uppercase text-muted-foreground">{order.paymentMethod}</td>
                        <td className="py-3 pr-4"><PriceTag price={order.total} size="sm" /></td>
                        <td className="py-3 pr-4">
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
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : order.id)}
                            aria-label="Toggle order details"
                            className="rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-b border-border bg-muted/30">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</div>
                                <ul className="space-y-1.5">
                                  {order.items.map((it) => (
                                    <li key={it.id} className="flex items-center justify-between gap-4">
                                      <span>{it.name} <span className="text-muted-foreground">× {it.qty}</span></span>
                                      <PriceTag price={it.price * it.qty} size="sm" />
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-3 space-y-1 border-t border-border pt-2 text-sm">
                                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><PriceTag price={order.subtotal} size="sm" /></div>
                                  {!!order.discount && (
                                    <div className="flex justify-between text-emerald-500">
                                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                                      <span>-<PriceTag price={order.discount} size="sm" /></span>
                                    </div>
                                  )}
                                  {!!order.shippingFee && <div className="flex justify-between text-muted-foreground"><span>Shipping</span><PriceTag price={order.shippingFee} size="sm" /></div>}
                                  <div className="flex justify-between font-semibold"><span>Total</span><PriceTag price={order.total} size="sm" /></div>
                                </div>
                              </div>
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</div>
                                {order.shippingAddress ? (
                                  <div className="text-sm leading-6">
                                    <div className="font-medium">{order.shippingAddress.fullName}</div>
                                    <div className="text-muted-foreground">{order.shippingAddress.phone}</div>
                                    <div className="text-muted-foreground">
                                      {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                                    </div>
                                    <div className="text-muted-foreground">
                                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                    </div>
                                    <div className="text-muted-foreground">{order.shippingAddress.country}</div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground">No address on file.</div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
