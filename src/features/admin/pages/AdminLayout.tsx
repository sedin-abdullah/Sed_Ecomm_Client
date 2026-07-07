import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, ShieldCheck, ClipboardCheck, History, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useChangeRequests } from '@/features/admin/hooks/useManager';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
];

// Manager-only modules, appended to the sidebar when the user is a manager.
const MANAGER_NAV = [
  { to: '/admin/pending', icon: ClipboardCheck, label: 'Pending Approval', end: false },
  { to: '/admin/audit', icon: History, label: 'Audit Trail', end: false },
  { to: '/admin/admins', icon: ShieldCheck, label: 'Admins', end: false },
];

/** Live count of pending change requests — only mounted for managers. */
function PendingBadge() {
  const { data } = useChangeRequests('pending');
  if (!data?.length) return null;
  return (
    <span className="ml-auto rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">{data.length}</span>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isManager = user?.role === 'manager';
  const nav = isManager ? [...NAV, ...MANAGER_NAV] : NAV;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Sed_Ecomm</span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {isManager ? 'Manager' : 'Admin'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user?.name && <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </header>

      <div className="container grid flex-1 gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-100 text-brand-700' : 'text-muted-foreground hover:bg-surface-2',
                )
              }
            >
              <Icon className="size-4" /> {label}
              {isManager && to === '/admin/pending' && <PendingBadge />}
            </NavLink>
          ))}
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
