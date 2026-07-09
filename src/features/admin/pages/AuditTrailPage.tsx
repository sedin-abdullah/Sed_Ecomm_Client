import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { isSuperAdmin, roleLabel } from '@/lib/roles';
import type { UserRole } from '@/types';
import { useActivity, type ActivityEntry, type FieldChange } from '@/features/admin/hooks/useManager';

function fmtValue(v: unknown): string {
  if (v === undefined || v === null || v === '') return '∅';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function Changes({ changes }: { changes?: FieldChange[] }) {
  if (!changes?.length) return null;
  return (
    <div className="mt-2 space-y-1">
      {changes.map((c) => (
        <div key={c.field} className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium">{c.field}:</span>
          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-red-600 line-through">{fmtValue(c.from)}</span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600">{fmtValue(c.to)}</span>
        </div>
      ))}
    </div>
  );
}

export function AuditTrailPage() {
  const role = useAuthStore((s) => s.user?.role);
  const [ownersOnly, setOwnersOnly] = useState(false);
  const { data: items, isLoading } = useActivity(ownersOnly ? 'admin' : undefined);
  const [open, setOpen] = useState<string | null>(null);

  // Complete activity log is Super Admin only.
  if (role && !isSuperAdmin(role)) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={ownersOnly} onChange={(e) => setOwnersOnly(e.target.checked)} />
          Store Owners only (fraud review)
        </label>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">Loading...</p>
      ) : !items?.length ? (
        <p className="py-10 text-center text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((a: ActivityEntry) => {
            const isOpen = open === a.id;
            const hasDetail = !!(a.changes?.length || a.before || a.payload);
            return (
              <Card key={a.id}>
                <CardBody className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold capitalize text-brand-700">{a.module}</span>
                        {a.actorRole && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.actorRole === 'admin' ? 'bg-amber-500/15 text-amber-600' : 'bg-surface-2 text-muted-foreground'}`}>
                            {roleLabel(a.actorRole as UserRole)}
                          </span>
                        )}
                        <span className="font-medium">{a.summary ?? `${a.action} ${a.module}`}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        by <span className="font-medium text-foreground">{a.actorName}</span> · {new Date(a.createdAt).toLocaleString()}
                      </div>
                      {isOpen && <Changes changes={a.changes} />}
                    </div>
                    {hasDetail && (
                      <button onClick={() => setOpen(isOpen ? null : a.id)} className="shrink-0 rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground" aria-label="Details">
                        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
