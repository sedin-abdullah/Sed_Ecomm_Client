import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/store/toastStore';

export function AdminCouponsPage() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const toast = useToast();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createCoupon.mutate(
      { code: code.toUpperCase(), type, value: Number(value), expiresAt },
      {
        onSuccess: () => {
          toast.success('Coupon created');
          setCode('');
          setValue('');
          setExpiresAt('');
        },
        onError: () => toast.error('Failed to create coupon — check all fields are filled in'),
      },
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>

      <Card>
        <CardBody>
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
            <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Select label="Type" value={type} onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </Select>
            <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <Input
              label="Expires at"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <Button type="submit" isLoading={createCoupon.isPending}>Add coupon</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Code</th>
                <th className="py-2">Discount</th>
                <th className="py-2">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                coupons?.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono">{c.code}</td>
                    <td>{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                    <td>
                      <button
                        onClick={() => updateCoupon.mutate({ id: c.id, patch: { isActive: !c.isActive } })}
                        className={c.isActive ? 'text-success' : 'text-muted-foreground'}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="text-right">
                      <button onClick={() => deleteCoupon.mutate(c.id)} className="text-danger" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </button>
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
