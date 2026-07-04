import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useCartCountStore } from '@/store/cartCountStore';
import { useCurrencyStore, type CurrencyCode } from '@/store/currencyStore';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/features/products/hooks/useProducts';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useProductI18n } from '@/lib/productI18n';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/imageFallback';
import i18n from '@/i18n';

const CURRENCIES: CurrencyCode[] = ['USD', 'INR', 'EUR', 'AED', 'CNY', 'JPY', 'GBP'];

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resolved = useThemeStore((state) => state.resolved);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartCount = useCartCountStore((state) => state.cartCount);
  const wishlistCount = useCartCountStore((state) => state.wishlistCount);
  // Mount the cart/wishlist queries app-wide (the Header is always rendered) so
  // their badge counts stay live on every page and react to add/remove/qty
  // mutations, login/logout, and refetch-on-focus — not just on their own pages.
  useCart();
  useWishlist();
  const pi = useProductI18n();
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: suggestions } = useSearchSuggestions(debouncedQuery);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sticky glass navbar that strengthens + shrinks once scrolled, and slides
  // out of the way when scrolling down / back in when scrolling up.
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 140 && y > prev && !mobileOpen && !searchFocused);
  });

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchFocused(false);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <motion.header
      animate={{ y: hidden ? '-105%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border-[color:var(--glass-border)] bg-[var(--glass-bg)] shadow-elevated'
          : 'border-transparent bg-transparent',
      )}
    >
      <div
        className={cn(
          'container flex items-center gap-4 transition-[height] duration-300',
          scrolled ? 'h-14' : 'h-16',
        )}
      >
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-surface-2 lg:hidden"
          aria-label={t('nav.menu')}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="shrink-0 text-xl font-bold tracking-tight text-foreground">
          Sed<span className="text-brand-500">_</span>Ecomm
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.home')}
          </Link>
          <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.shop')}
          </Link>
          <Link
            to="/products?onSale=1"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('nav.deals')}
          </Link>
        </nav>

        <div ref={searchRef} className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <form onSubmit={submitSearch}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
              placeholder={t('nav.search_placeholder') ?? ''}
              leftIcon={<Search className="size-4" />}
              aria-label={t('common.search') ?? 'Search'}
            />
          </form>
          <AnimatePresence>
            {searchFocused && suggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-elevated"
              >
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/products/${s.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-2"
                    >
                      {s.image && <img src={s.image} alt="" onError={handleImageError} className="size-8 rounded-lg object-cover" />}
                      {pi.rawName(s.name)}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <select
            aria-label={t('language.select') ?? 'Language'}
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="hidden rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm text-foreground sm:block"
          >
            {SUPPORTED_LANGUAGES.map((lng) => (
              <option key={lng.code} value={lng.code}>
                {lng.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="hidden rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm text-foreground sm:block"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('theme.toggle') ?? 'Toggle theme'}
            className="rounded-lg p-2 text-foreground hover:bg-surface-2"
          >
            {resolved === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <Link to="/wishlist" aria-label={t('nav.wishlist') ?? 'Wishlist'} className="relative rounded-lg p-2 text-foreground transition-transform hover:scale-110 hover:bg-surface-2">
            <Heart className="size-5" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white shadow-glow"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link to="/cart" aria-label={t('nav.cart') ?? 'Cart'} className="relative rounded-lg p-2 text-foreground transition-transform hover:scale-110 hover:bg-surface-2">
            <ShoppingBag className="size-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white shadow-glow"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label={t('nav.account') ?? 'Account'}
            className="rounded-lg p-2 text-foreground hover:bg-surface-2"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('overflow-hidden border-t border-border lg:hidden')}
          >
            <div className="container flex flex-col gap-1 py-3">
              <form onSubmit={submitSearch} className="mb-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('nav.search_placeholder') ?? ''}
                  leftIcon={<Search className="size-4" />}
                />
              </form>
              <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-surface-2">
                {t('nav.home')}
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-surface-2">
                {t('nav.shop')}
              </Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-surface-2">
                {t('nav.wishlist')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
