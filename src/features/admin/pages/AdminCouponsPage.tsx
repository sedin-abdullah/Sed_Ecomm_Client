import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/features/admin/hooks/useAdmin';
import type { Coupon } from '@/types';
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  function resetForm() {
    setEditingId(null);
    setCode('');
    setType('percentage');
    setValue('');
    setExpiresAt('');
  }

  function startEdit(c: Coupon) {
    setEditingId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 10) : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { code: code.toUpperCase(), type, value: Number(value), expiresAt };
    if (editingId) {
      updateCoupon.mutate(
        { id: editingId, patch: payload },
        {
          onSuccess: () => { toast.success('Coupon updated — live now'); resetForm(); },
          onError: () => toast.error('Failed to update coupon'),
        },
      );
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => { toast.success('Coupon created'); resetForm(); },
        onError: () => toast.error('Failed to create coupon — check all fields are filled in'),
      });
    }
  }

  const saving = createCoupon.isPending || updateCoupon.isPending;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>

      <Card>
        <CardBody>
          {editingId && (
            <p className="mb-3 text-sm font-medium text-brand-500">Editing coupon — changes go live immediately on save.</p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
            <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Select label="Type" value={type} onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </Select>
            <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <Input label="Expires at" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            <Button type="submit" isLoading={saving}>{editingId ? 'Update coupon' : 'Add coupon'}</Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            )}
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
                <th className="py-2">Expires</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                coupons?.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono">{c.code}</td>
                    <td>{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                    <td className="text-muted-foreground">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <button
                        onClick={() => updateCoupon.mutate({ id: c.id, patch: { isActive: !c.isActive } })}
                        className={c.isActive ? 'text-success' : 'text-muted-foreground'}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(c)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground" aria-label="Edit">
                          <Pencil className="size-4" />
                        </button>
                        <button onClick={() => deleteCoupon.mutate(c.id)} className="rounded-md p-1.5 text-danger hover:bg-surface-2" aria-label="Delete">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
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
