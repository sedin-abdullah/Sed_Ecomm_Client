import { useAdminCustomers } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function AdminCustomersPage() {
  const { data: customers, isLoading } = useAdminCustomers();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                customers?.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-3">{c.name}</td>
                    <td>{c.email}</td>
                    <td><Badge variant={c.role === 'admin' ? 'brand' : 'neutral'}>{c.role}</Badge></td>
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
