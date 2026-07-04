import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
];

export function AdminLayout() {
  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="flex gap-2 overflow-x-auto lg:flex-col">
        {NAV.map(({ to, icon: Icon, label, end }) => (
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
          </NavLink>
        ))}
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
