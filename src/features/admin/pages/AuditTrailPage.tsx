import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { useChangeRequests, type ChangeRequest } from '@/features/admin/hooks/useManager';

const STATUS_STYLE: Record<ChangeRequest['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-600',
  approved: 'bg-emerald-500/15 text-emerald-600',
  rejected: 'bg-red-500/15 text-red-600',
};

export function AuditTrailPage() {
  const role = useAuthStore((s) => s.user?.role);
  const { data: items, isLoading } = useChangeRequests();

  if (role && role !== 'manager') return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Admin</th>
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Reviewed by</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : !items?.length ? (
                <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No activity yet.</td></tr>
              ) : (
                items.map((cr) => (
                  <tr key={cr.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">{new Date(cr.createdAt).toLocaleString()}</td>
                    <td className="py-3 pr-4 font-medium">{cr.actorName}</td>
                    <td className="py-3 pr-4 capitalize">{cr.module}</td>
                    <td className="py-3 pr-4 capitalize">{cr.action}</td>
                    <td className="py-3 pr-4">{cr.targetLabel ?? '—'}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[cr.status]}`}>{cr.status}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {cr.reviewerName ? `${cr.reviewerName}${cr.reviewedAt ? ` · ${new Date(cr.reviewedAt).toLocaleDateString()}` : ''}` : '—'}
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
