import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, LogOut, MapPin, Package, Pencil, Shield, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout, useUpdateProfile } from '@/features/auth/hooks/useAuth';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from '@/features/checkout/hooks/useCheckout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';

type AddressForm = Omit<Address, 'id'>;

const EMPTY_ADDRESS: AddressForm = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

const NOTIF_PREFS_KEY = 'sed-ecomm-notif-prefs';
const NOTIF_OPTIONS: { key: string; label: string }[] = [
  { key: 'orderUpdates', label: 'Order status updates' },
  { key: 'promotions', label: 'Promotions & offers' },
  { key: 'priceDrops', label: 'Price-drop alerts' },
  { key: 'newsletter', label: 'Weekly newsletter' },
];

function ProfileCard() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const dirty = name !== (user?.name ?? '') || phone !== (user?.phone ?? '');

  function save() {
    updateProfile.mutate(
      { name: name.trim(), phone: phone.trim() || undefined },
      { onSuccess: () => toast.success('Profile updated') },
    );
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="text-sm font-semibold">Profile</h2>
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={user?.email ?? ''} disabled hint="Email can't be changed" />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Add a phone number" />
        <Button className="w-full" disabled={!dirty} isLoading={updateProfile.isPending} onClick={save}>
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}

function AddressCard() {
  const { data: addresses } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_ADDRESS);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_ADDRESS);
    setOpen(true);
  }

  function openEdit(address: Address) {
    const { id: _id, ...rest } = address;
    void _id;
    setEditingId(address.id);
    setForm({ ...EMPTY_ADDRESS, ...rest });
    setOpen(true);
  }

  function save() {
    const onSuccess = () => {
      toast.success(editingId ? 'Address updated' : 'Address added');
      setOpen(false);
    };
    if (editingId) {
      updateAddress.mutate({ id: editingId, patch: form }, { onSuccess });
    } else {
      addAddress.mutate(form, { onSuccess });
    }
  }

  const set = (k: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Addresses</h2>
          <Button size="sm" variant="outline" onClick={openAdd}>+ Add</Button>
        </div>

        {!addresses?.length && <p className="text-sm text-muted-foreground">No saved addresses yet.</p>}

        <div className="space-y-3">
          {addresses?.map((address) => (
            <div key={address.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">
                    {address.fullName}
                    {address.isDefault && (
                      <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(address)} className="text-muted-foreground hover:text-foreground" aria-label="Edit address">
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => deleteAddress.mutate(address.id, { onSuccess: () => toast.success('Address removed') })}
                  className="text-danger"
                  aria-label="Delete address"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? 'Edit address' : 'Add address'} size="lg">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Full name" className="col-span-2" value={form.fullName} onChange={set('fullName')} />
          <Input label="Phone" value={form.phone} onChange={set('phone')} />
          <Input label="Country" value={form.country} onChange={set('country')} />
          <Input label="Address line 1" className="col-span-2" value={form.line1} onChange={set('line1')} />
          <Input label="Address line 2" className="col-span-2" value={form.line2 ?? ''} onChange={set('line2')} />
          <Input label="City" value={form.city} onChange={set('city')} />
          <Input label="State" value={form.state} onChange={set('state')} />
          <Input label="Postal code" value={form.postalCode} onChange={set('postalCode')} />
          <label className="col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.isDefault)}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            />
            Set as default address
          </label>
        </div>
        <Button className="mt-4 w-full" isLoading={addAddress.isPending || updateAddress.isPending} onClick={save}>
          {editingId ? 'Save address' : 'Add address'}
        </Button>
      </Modal>
    </Card>
  );
}

function NotificationsCard() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orderUpdates: true,
    promotions: true,
    priceDrops: false,
    newsletter: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_PREFS_KEY);
    if (stored) {
      try {
        setPrefs((p) => ({ ...p, ...JSON.parse(stored) }));
      } catch {
        // Ignore malformed stored prefs and keep defaults.
      }
    }
  }, []);

  function toggle(key: string) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <Card>
      <CardBody className="space-y-3">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <div className="space-y-2">
          {NOTIF_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm"
            >
              <span>{label}</span>
              <span
                className={cn(
                  'relative h-5 w-9 rounded-full transition-colors',
                  prefs[key] ? 'bg-brand-500' : 'bg-surface-2',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
                    prefs[key] ? 'translate-x-4' : 'translate-x-0.5',
                  )}
                />
              </span>
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function AccountPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{t('nav.account')}</h1>
      <div className="space-y-4">
        <ProfileCard />
        <AddressCard />
        <NotificationsCard />

        <Card>
          <CardBody className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/orders')}>
              <Package className="mr-2 size-4" /> My orders
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/wishlist')}>
              <Heart className="mr-2 size-4" /> Wishlist
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin')}>
                <Shield className="mr-2 size-4" /> Admin dashboard
              </Button>
            )}
            <Button
              variant="danger"
              className="w-full justify-start"
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
            >
              <LogOut className="mr-2 size-4" /> {t('auth.logout')}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
