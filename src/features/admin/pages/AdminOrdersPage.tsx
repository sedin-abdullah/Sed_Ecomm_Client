import { Fragment, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  useAdminOrders,
  useUpdateOrderStatus,
  useAdminRefunds,
  useProcessRefund,
  useAdminCancelledOrders,
} from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PriceTag } from '@/components/ui/PriceTag';
import { useToast } from '@/store/toastStore';
import { getApiErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/utils';
import type { Order, RefundMethod } from '@/types';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const REFUND_METHODS: RefundMethod[] = ['card', 'upi', 'cash'];

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function deliveredAt(order: Order): string | undefined {
  const events = order.trackingTimeline ?? [];
  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].status === 'delivered') return events[i].timestamp;
  }
  return undefined;
}

function cancelledAt(order: Order): string | undefined {
  const events = order.trackingTimeline ?? [];
  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].status === 'cancelled') return events[i].timestamp;
  }
  return order.updatedAt;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

// ---- All orders (existing table) ----

function AllOrdersTab() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
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
  );
}

// ---- Refunds tab ----

function RefundsTab() {
  const { data: orders, isLoading } = useAdminRefunds();
  const processRefund = useProcessRefund();
  const toast = useToast();
  const [methods, setMethods] = useState<Record<string, RefundMethod>>({});

  function onProcess(order: Order) {
    const method = methods[order.id] ?? 'card';
    processRefund.mutate(
      { id: order.id, method },
      {
        onSuccess: () => toast.success('Refund processed — the customer has been notified'),
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to process refund')),
      },
    );
  }

  if (isLoading) return <p className="py-10 text-center text-muted-foreground">Loading...</p>;
  if (!orders?.length) return <p className="py-10 text-center text-muted-foreground">No refund requests yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order: Order) => {
        const refund = order.refund!;
        const busy = processRefund.isPending && processRefund.variables?.id === order.id;
        return (
          <Card key={order.id}>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</span>
                  <Badge variant={refund.status === 'processed' ? 'success' : 'warning'}>
                    {refund.status === 'processed' ? 'Refund processed' : 'Refund requested'}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Requested {formatDate(refund.requestedAt)}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Customer information */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</div>
                  <Field label="Name">{order.user?.name ?? order.shippingAddress?.fullName ?? '—'}</Field>
                  <Field label="Email (login)">{order.user?.email ?? '—'}</Field>
                  <Field label="Mobile">{order.user?.phone ?? order.shippingAddress?.phone ?? '—'}</Field>
                </div>

                {/* Order information */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</div>
                  <Field label="Products">
                    <ul className="space-y-0.5">
                      {order.items.map((it) => (
                        <li key={it.id} className="flex items-center justify-between gap-3">
                          <span>{it.name} × {it.qty}</span>
                          <PriceTag price={it.price * it.qty} size="sm" />
                        </li>
                      ))}
                    </ul>
                  </Field>
                  <Field label="Discount applied">{order.discount ? <PriceTag price={order.discount} size="sm" /> : '—'}</Field>
                  <Field label="Final amount paid"><PriceTag price={order.total} size="sm" /></Field>
                  <Field label="Order date">{formatDate(order.createdAt)}</Field>
                  <Field label="Delivery date">{formatDate(deliveredAt(order))}</Field>
                </div>

                {/* Payment + reason */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</div>
                  <Field label="Payment method"><span className="uppercase">{order.paymentMethod}</span></Field>
                  <Field label="Transaction ID"><span className="font-mono text-xs">{order.payment?.id ?? '—'}</span></Field>
                  <Field label="Payment status"><span className="capitalize">{order.paymentStatus ?? '—'}</span></Field>
                  <div className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Refund reason</div>
                  <Field label="Reason">{refund.reason}</Field>
                  {refund.comments && <Field label="Comments">{refund.comments}</Field>}
                </div>
              </div>

              {refund.status === 'requested' ? (
                <div className="flex flex-wrap items-end gap-3 border-t border-border pt-3">
                  <Select
                    label="Refund method"
                    value={methods[order.id] ?? 'card'}
                    onChange={(e) => setMethods((m) => ({ ...m, [order.id]: e.target.value as RefundMethod }))}
                    className="w-40"
                  >
                    {REFUND_METHODS.map((m) => (
                      <option key={m} value={m}>{m.toUpperCase()}</option>
                    ))}
                  </Select>
                  <Button onClick={() => onProcess(order)} isLoading={busy}>Process Refund</Button>
                </div>
              ) : (
                <div className="space-y-1 border-t border-border pt-3 text-sm">
                  <div><span className="text-muted-foreground">Refund method:</span> <span className="uppercase">{refund.method}</span></div>
                  <div><span className="text-muted-foreground">Processed by:</span> {refund.processedBy} · {formatDate(refund.processedAt)}</div>
                  {refund.message && <div className="text-muted-foreground">“{refund.message}”</div>}
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

// ---- Cancelled tab ----

function CancelledTab() {
  const { data: orders, isLoading } = useAdminCancelledOrders();

  return (
    <Card>
      <CardBody className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Products</th>
              <th className="py-2 pr-4">Cancelled on</th>
              <th className="py-2 pr-4">Cancelled by</th>
              <th className="py-2 pr-4">Reason</th>
              <th className="py-2 pr-4">Payment</th>
              <th className="py-2">Refund</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
            ) : !orders?.length ? (
              <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No cancelled orders.</td></tr>
            ) : (
              orders.map((order: Order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 pr-4">{order.user?.name ?? '—'}</td>
                  <td className="py-3 pr-4">
                    {order.items.map((it) => it.name).join(', ')}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">{formatDate(cancelledAt(order))}</td>
                  <td className="py-3 pr-4">{order.cancelledBy ?? '—'}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{order.cancellationReason ?? '—'}</td>
                  <td className="py-3 pr-4 capitalize text-muted-foreground">{order.paymentStatus ?? '—'}</td>
                  <td className="py-3 capitalize text-muted-foreground">{order.refund?.status ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

// ---- Page with tabs ----

type OrdersTab = 'all' | 'refunds' | 'cancelled';

const TABS: { key: OrdersTab; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'refunds', label: 'Refund' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function AdminOrdersPage() {
  const [tab, setTab] = useState<OrdersTab>('all');
  const { data: refunds } = useAdminRefunds();
  const pendingRefunds = refunds?.filter((o: Order) => o.refund?.status === 'requested').length ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      <div className="flex gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            data-testid={`orders-tab-${key}`}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              tab === key ? 'bg-brand-100 text-brand-700' : 'text-muted-foreground hover:bg-surface-2',
            )}
          >
            {label}
            {key === 'refunds' && pendingRefunds > 0 && (
              <span className="rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">{pendingRefunds}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'all' && <AllOrdersTab />}
      {tab === 'refunds' && <RefundsTab />}
      {tab === 'cancelled' && <CancelledTab />}
    </div>
  );
}
