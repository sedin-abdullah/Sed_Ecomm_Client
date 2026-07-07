import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/toastStore';
import {
  useApproveChange,
  useChangeRequests,
  useRejectChange,
  type ChangeRequest,
} from '@/features/admin/hooks/useManager';

const ACTION_LABEL: Record<ChangeRequest['action'], string> = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  status: 'Status',
};

function Details({ cr }: { cr: ChangeRequest }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      {cr.before && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Before</div>
          <pre className="max-h-52 overflow-auto rounded-lg bg-surface-2 p-2 text-xs">{JSON.stringify(cr.before, null, 2)}</pre>
        </div>
      )}
      {cr.payload && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {cr.action === 'create' ? 'New' : 'Requested change'}
          </div>
          <pre className="max-h-52 overflow-auto rounded-lg bg-surface-2 p-2 text-xs">{JSON.stringify(cr.payload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export function PendingApprovalPage() {
  const role = useAuthStore((s) => s.user?.role);
  const toast = useToast();
  const { data: items, isLoading } = useChangeRequests('pending');
  const approve = useApproveChange();
  const reject = useRejectChange();
  const [open, setOpen] = useState<string | null>(null);

  if (role && role !== 'manager') return <Navigate to="/admin" replace />;

  function onApprove(id: string) {
    approve.mutate(id, {
      onSuccess: () => toast.success('Approved & applied'),
      onError: () => toast.error('Failed to approve'),
    });
  }
  function onReject(id: string) {
    reject.mutate({ id }, {
      onSuccess: () => toast.success('Change rejected'),
      onError: () => toast.error('Failed to reject'),
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Pending Approval {items?.length ? `(${items.length})` : ''}
      </h1>

      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">Loading...</p>
      ) : !items?.length ? (
        <p className="py-10 text-center text-muted-foreground">🎉 No changes waiting for approval.</p>
      ) : (
        items.map((cr) => {
          const isOpen = open === cr.id;
          const busy = (approve.isPending && approve.variables === cr.id) || (reject.isPending && reject.variables?.id === cr.id);
          return (
            <Card key={cr.id}>
              <CardBody className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">{cr.module}</span>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium">{ACTION_LABEL[cr.action]}</span>
                      <span className="truncate font-medium">{cr.targetLabel ?? '—'}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      by <span className="font-medium text-foreground">{cr.actorName}</span> · {new Date(cr.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setOpen(isOpen ? null : cr.id)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Details">
                      <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <Button variant="outline" isLoading={busy} onClick={() => onReject(cr.id)}>
                      <X className="mr-1 size-4" /> Reject
                    </Button>
                    <Button isLoading={busy} onClick={() => onApprove(cr.id)}>
                      <Check className="mr-1 size-4" /> Approve
                    </Button>
                  </div>
                </div>
                {isOpen && <Details cr={cr} />}
              </CardBody>
            </Card>
          );
        })
      )}
    </div>
  );
}
