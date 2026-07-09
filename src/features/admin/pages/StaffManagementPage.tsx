import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Copy, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/toastStore';
import { isManagerPlus, isSuperAdmin } from '@/lib/roles';
import {
  useCreateStaff,
  useSetStaffStatus,
  useStaff,
  type CreatedStaff,
  type StaffKind,
} from '@/features/admin/hooks/useManager';

interface Props {
  kind: StaffKind;
  singular: string; // e.g. "Store Owner"
  plural: string; // e.g. "Store Owners"
  requireSuper?: boolean; // Managers page = super admin only
}

function StaffManagementPage({ kind, singular, plural, requireSuper }: Props) {
  const role = useAuthStore((s) => s.user?.role);
  const toast = useToast();
  const { data: staff, isLoading } = useStaff(kind);
  const create = useCreateStaff(kind);
  const setStatus = useSetStaffStatus(kind);
  const [created, setCreated] = useState<CreatedStaff | null>(null);

  const allowed = requireSuper ? isSuperAdmin(role) : isManagerPlus(role);
  if (role && !allowed) return <Navigate to="/admin" replace />;

  function copy(label: string, value: string) {
    navigator.clipboard?.writeText(value).then(
      () => toast.success(`${label} copied`),
      () => toast.error('Could not copy'),
    );
  }

  function handleCreate() {
    create.mutate(undefined, {
      onSuccess: (acct) => {
        setCreated(acct);
        toast.success(`${singular} created`);
      },
      onError: () => toast.error(`Failed to create ${singular.toLowerCase()}`),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{plural}</h1>
        <Button onClick={handleCreate} isLoading={create.isPending}>
          <UserPlus className="mr-1.5 size-4" /> Create {singular}
        </Button>
      </div>

      {created && (
        <Card className="border-brand-500/40">
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">New {singular.toLowerCase()} credentials</h2>
              <button onClick={() => setCreated(null)} className="text-sm text-muted-foreground hover:text-foreground">Dismiss</button>
            </div>
            <p className="text-sm text-muted-foreground">Copy and share these now — the password is shown only once.</p>
            {[
              { label: 'Login email', value: created.email },
              { label: 'Password', value: created.password },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="truncate font-mono text-sm">{value}</div>
                </div>
                <button onClick={() => copy(label, value)} aria-label={`Copy ${label}`} className="shrink-0 rounded-lg border border-border p-2 hover:bg-surface">
                  <Copy className="size-4" />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Login email</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : !staff?.length ? (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No {plural.toLowerCase()} yet.</td></tr>
              ) : (
                staff.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium">{a.name}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{a.email}</td>
                    <td className="py-3 pr-4">
                      <span className={a.isActive ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600' : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'}>
                        {a.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="outline" onClick={() => setStatus.mutate({ id: a.id, isActive: !a.isActive })} isLoading={setStatus.isPending && setStatus.variables?.id === a.id}>
                        {a.isActive ? 'Disable' : 'Enable'}
                      </Button>
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

export function StoreOwnersPage() {
  return <StaffManagementPage kind="store-owners" singular="Store Owner" plural="Store Owners" />;
}

export function ManagersPage() {
  return <StaffManagementPage kind="managers" singular="Manager" plural="Managers" requireSuper />;
}
