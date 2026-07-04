import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Home, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartCountStore } from '@/store/cartCountStore';

export function MobileBottomNav() {
  const { t } = useTranslation();
  const cartCount = useCartCountStore((state) => state.cartCount);

  const items = [
    { to: '/', icon: Home, label: t('mobile_nav.home') },
    { to: '/products', icon: Search, label: t('mobile_nav.shop') },
    { to: '/wishlist', icon: Heart, label: t('mobile_nav.wishlist') },
    { to: '/cart', icon: ShoppingBag, label: t('mobile_nav.cart'), badge: cartCount },
    { to: '/account', icon: User, label: t('mobile_nav.account') },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-brand-500' : 'text-muted-foreground',
              )
            }
          >
            <span className="relative">
              <Icon className="size-5" />
              {typeof badge === 'number' && badge > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-brand-500 text-[9px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
