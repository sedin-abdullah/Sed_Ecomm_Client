import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useOrders, useRequestRefund } from '@/features/orders/hooks/useOrders';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PriceTag } from '@/components/ui/PriceTag';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/store/toastStore';
import { getApiErrorMessage } from '@/lib/apiError';
import type { Order } from '@/types';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'neutral',
};

const REFUND_REASONS = [
  'Damaged product',
  'Wrong item received',
  'Quality not as expected',
  'Item no longer needed',
  'Other',
];

function RefundSection({ order }: { order: Order }) {
  const toast = useToast();
  const requestRefund = useRequestRefund();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REFUND_REASONS[0]);
  const [comments, setComments] = useState('');

  // Refund already requested/processed → show its status to the customer.
  if (order.refund) {
    const { status, method, processedAt, message } = order.refund;
    return (
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm" data-testid="refund-status">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status === 'processed' ? 'success' : 'warning'}>
            {status === 'processed' ? 'Refund processed' : 'Refund requested'}
          </Badge>
          {status === 'processed' && method && (
            <span className="text-xs text-muted-foreground">
              via {method.toUpperCase()} · {processedAt ? new Date(processedAt).toLocaleString() : ''}
            </span>
          )}
        </div>
        {status === 'processed' && message ? (
          <p className="mt-2 text-muted-foreground">{message}</p>
        ) : (
          <p className="mt-2 text-muted-foreground">Your refund request is being reviewed by the store.</p>
        )}
      </div>
    );
  }

  // Only delivered orders can request a refund.
  if (order.status !== 'delivered') return null;

  function submit() {
    requestRefund.mutate(
      { id: order.id, reason, comments },
      {
        onSuccess: () => toast.success('Refund request submitted'),
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to submit refund request')),
      },
    );
  }

  return (
    <div className="mt-3">
      {!open ? (
        <Button variant="outline" data-testid="request-refund" onClick={() => setOpen(true)}>
          <RotateCcw className="mr-1.5 size-4" /> Request Refund
        </Button>
      ) : (
        <div className="space-y-3 rounded-xl border border-border bg-surface-2 p-3">
          <Select label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} data-testid="refund-reason">
            {REFUND_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
          <div>
            <label className="mb-1 block text-sm font-medium">Additional comments (optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              data-testid="refund-comments"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Tell us more about the issue…"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={submit} isLoading={requestRefund.isPending} data-testid="refund-submit">
              Submit request
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

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
            <Card key={order.id}>
              <CardBody>
                <Link to={`/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'neutral'}>{order.status}</Badge>
                  <PriceTag price={order.total} size="sm" />
                </Link>
                <RefundSection order={order} />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
