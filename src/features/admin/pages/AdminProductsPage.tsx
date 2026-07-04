import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminProducts, useDeleteProduct, useCreateProduct, useUpdateProduct } from '@/features/admin/hooks/useAdmin';
import { useCategories } from '@/features/products/hooks/useCategories';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PriceTag } from '@/components/ui/PriceTag';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/imageFallback';
import { getApiErrorMessage } from '@/lib/apiError';
import type { Product } from '@/types';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  brand: string;
  sizes: string;
  colors: string;
  tags: string;
  isFeatured: boolean;
  isFlashSale: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  category: '',
  brand: '',
  sizes: '',
  colors: '',
  tags: '',
  isFeatured: false,
  isFlashSale: false,
  isNewArrival: false,
  isBestSeller: false,
};

type FlagKey = 'isFeatured' | 'isFlashSale' | 'isNewArrival' | 'isBestSeller';

const FLAGS: { key: FlagKey; label: string }[] = [
  { key: 'isFeatured', label: 'Featured' },
  { key: 'isFlashSale', label: 'Flash Sale' },
  { key: 'isNewArrival', label: 'New Arrival' },
  { key: 'isBestSeller', label: 'Best Seller' },
];

function categoryIdOf(product: Product): string {
  return typeof product.category === 'string' ? product.category : product.category.id;
}

export function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  function openCreate() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stock: String(product.stock),
      category: categoryIdOf(product),
      brand: product.brand ?? '',
      sizes: product.variants?.sizes.join(', ') ?? '',
      colors: product.variants?.colors.join(', ') ?? '',
      tags: product.tags?.join(', ') ?? '',
      isFeatured: product.isFeatured ?? false,
      isFlashSale: product.isFlashSale ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isBestSeller: product.isBestSeller ?? false,
    });
    setImageFiles([]);
    setOpen(true);
  }

  function toggleFlag(key: FlagKey) {
    setForm((f) => ({ ...f, [key]: !f[key] }));
  }

  function handleSubmit() {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      category: form.category,
      brand: form.brand || undefined,
      sizes: form.sizes || undefined,
      colors: form.colors || undefined,
      tags: form.tags || undefined,
      isFeatured: form.isFeatured,
      isFlashSale: form.isFlashSale,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      imageFiles,
    };

    if (!form.name.trim() || !form.category || !form.price) {
      toast.error('Name, category and price are required');
      return;
    }
    if (form.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    const handlers = {
      onSuccess: () => {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setOpen(false);
      },
      onError: (err: unknown) =>
        toast.error(getApiErrorMessage(err, editingProduct ? 'Failed to update product' : 'Failed to create product')),
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, payload }, handlers);
    } else {
      createProduct.mutate(payload, handlers);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button onClick={openCreate}>+ Add product</Button>
      </div>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              ) : (
                products?.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="flex items-center gap-3 py-3">
                      <img src={p.images[0]?.url} alt="" onError={handleImageError} className="size-10 rounded-lg object-cover" />
                      {p.name}
                    </td>
                    <td>
                      <PriceTag
                        price={p.discountPrice ?? p.price}
                        compareAtPrice={p.discountPrice ? p.price : undefined}
                        size="sm"
                      />
                    </td>
                    <td>{p.stock}</td>
                    <td className="whitespace-nowrap text-right">
                      <button onClick={() => openEdit(p)} className="mr-3 text-muted-foreground hover:text-foreground" aria-label="Edit">
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() =>
                          deleteProduct.mutate(p.id, {
                            onSuccess: () => toast.success('Product deleted'),
                            onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete product')),
                          })
                        }
                        className="text-danger hover:underline"
                        aria-label="Delete"
                      >
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

      <Modal open={open} onClose={() => setOpen(false)} title={editingProduct ? 'Edit product' : 'Add product'} size="lg">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name" className="col-span-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input
            label="Description"
            className="col-span-2"
            hint="At least 10 characters"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input label="Price (USD)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <Input
            label="Discount price (USD)"
            type="number"
            hint="Leave blank if not on sale"
            value={form.discountPrice}
            onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
          />
          <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          <Input label="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
          <Select
            label="Category"
            className="col-span-2"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="">Select category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Sizes" placeholder="S, M, L" value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} />
          <Input
            label="Colors"
            placeholder="Black, White"
            value={form.colors}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          />
          <Input
            label="Tags"
            className="col-span-2"
            placeholder="summer, casual"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />

          <div className="col-span-2">
            <p className="mb-2 text-sm font-medium text-foreground">Flags</p>
            <div className="flex flex-wrap gap-2">
              {FLAGS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFlag(key)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    form[key] ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border text-muted-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
            />
            {editingProduct && (
              <p className="mt-1 text-xs text-muted-foreground">
                New images are added to this product's existing {editingProduct.images.length} image(s) — uploading doesn't replace them.
              </p>
            )}
          </div>
        </div>
        <Button className="mt-4 w-full" isLoading={createProduct.isPending || updateProduct.isPending} onClick={handleSubmit}>
          {editingProduct ? 'Save changes' : 'Create product'}
        </Button>
      </Modal>
    </div>
  );
}
