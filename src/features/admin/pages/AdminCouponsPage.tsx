import { useMemo, useState } from 'react';
import { Trash2, Pencil, X } from 'lucide-react';
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useAdminProducts,
} from '@/features/admin/hooks/useAdmin';
import type { Coupon, Product } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/store/toastStore';

export function AdminCouponsPage() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const { data: products } = useAdminProducts();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const toast = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [productQuery, setProductQuery] = useState('');

  const productName = useMemo(() => {
    const m = new Map<string, string>();
    (products ?? []).forEach((p: Product) => m.set(p.id, p.name));
    return m;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return (products ?? []).filter((p: Product) => !q || p.name.toLowerCase().includes(q)).slice(0, 40);
  }, [products, productQuery]);

  function resetForm() {
    setEditingId(null);
    setCode('');
    setType('percentage');
    setValue('');
    setExpiresAt('');
    setApplicableProducts([]);
    setProductQuery('');
  }

  function startEdit(c: Coupon) {
    setEditingId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 10) : '');
    setApplicableProducts(c.applicableProducts ?? []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleProduct(id: string) {
    setApplicableProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { code: code.toUpperCase(), type, value: Number(value), expiresAt, applicableProducts };
    const onDone = (msg: string) => { toast.success(msg); resetForm(); };
    if (editingId) {
      updateCoupon.mutate({ id: editingId, patch: payload }, {
        onSuccess: () => onDone('Coupon updated — live now'),
        onError: () => toast.error('Failed to update coupon'),
      });
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => onDone('Coupon created'),
        onError: () => toast.error('Failed to create coupon — check all fields are filled in'),
      });
    }
  }

  const saving = createCoupon.isPending || updateCoupon.isPending;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>

      <Card>
        <CardBody className="space-y-4">
          {editingId && (
            <p className="text-sm font-medium text-brand-500">Editing coupon — changes go live immediately on save.</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
              <Select label="Type" value={type} onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </Select>
              <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
              <Input label="Expires at" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>

            {/* Product scope */}
            <div>
              <div className="mb-1 text-sm font-medium">Applies to</div>
              <p className="mb-2 text-xs text-muted-foreground">
                Leave empty to apply to the whole cart. Select products to restrict the discount to only those items.
              </p>
              {applicableProducts.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {applicableProducts.map((id) => (
                    <span key={id} className="flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                      {productName.get(id) ?? 'Product'}
                      <button type="button" onClick={() => toggleProduct(id)} aria-label="Remove"><X className="size-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <Input placeholder="Search products to add…" value={productQuery} onChange={(e) => setProductQuery(e.target.value)} />
              {productQuery && (
                <div className="mt-1 max-h-48 overflow-auto rounded-xl border border-border">
                  {filteredProducts.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No products match.</div>
                  ) : (
                    filteredProducts.map((p: Product) => (
                      <label key={p.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-2">
                        <input type="checkbox" checked={applicableProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                        {p.name}
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" isLoading={saving}>{editingId ? 'Update coupon' : 'Add coupon'}</Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
            </div>
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
                <th className="py-2">Applies to</th>
                <th className="py-2">Expires</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                coupons?.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono">{c.code}</td>
                    <td>{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                    <td className="text-muted-foreground">
                      {c.applicableProducts?.length ? `${c.applicableProducts.length} product${c.applicableProducts.length === 1 ? '' : 's'}` : 'All products'}
                    </td>
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
