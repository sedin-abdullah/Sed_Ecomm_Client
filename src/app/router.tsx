import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute, AdminRoute } from '@/app/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';

function lazyPage(loader: Parameters<typeof lazy>[0]) {
  const Component = lazy(loader);
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

const HomePage = () => import('@/features/products/pages/HomePage').then((m) => ({ default: m.HomePage }));
const ProductListingPage = () =>
  import('@/features/products/pages/ProductListingPage').then((m) => ({ default: m.ProductListingPage }));
const ProductDetailPage = () =>
  import('@/features/products/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }));
const CartPage = () => import('@/features/cart/pages/CartPage').then((m) => ({ default: m.CartPage }));
const WishlistPage = () => import('@/features/wishlist/pages/WishlistPage').then((m) => ({ default: m.WishlistPage }));
const CheckoutPage = () => import('@/features/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }));
const PaymentPage = () => import('@/features/checkout/pages/PaymentPage').then((m) => ({ default: m.PaymentPage }));
const OrdersPage = () => import('@/features/orders/pages/OrdersPage').then((m) => ({ default: m.OrdersPage }));
const OrderDetailPage = () =>
  import('@/features/orders/pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }));
const LoginPage = () => import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }));
const RegisterPage = () => import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }));
const ForgotPasswordPage = () =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }));
const ResetPasswordPage = () =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }));
const AccountPage = () => import('@/features/auth/pages/AccountPage').then((m) => ({ default: m.AccountPage }));

const AdminLayout = () => import('@/features/admin/pages/AdminLayout').then((m) => ({ default: m.AdminLayout }));
const AdminDashboardPage = () =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }));
const AdminProductsPage = () =>
  import('@/features/admin/pages/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage }));
const AdminOrdersPage = () =>
  import('@/features/admin/pages/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage }));
const AdminCustomersPage = () =>
  import('@/features/admin/pages/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage }));
const AdminCouponsPage = () =>
  import('@/features/admin/pages/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage }));
const StoreOwnersPage = () =>
  import('@/features/admin/pages/StaffManagementPage').then((m) => ({ default: m.StoreOwnersPage }));
const ManagersPage = () =>
  import('@/features/admin/pages/StaffManagementPage').then((m) => ({ default: m.ManagersPage }));
const AuditTrailPage = () =>
  import('@/features/admin/pages/AuditTrailPage').then((m) => ({ default: m.AuditTrailPage }));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: lazyPage(HomePage) },
      { path: 'products', element: lazyPage(ProductListingPage) },
      { path: 'category/:slug', element: lazyPage(ProductListingPage) },
      { path: 'products/:slug', element: lazyPage(ProductDetailPage) },
      { path: 'cart', element: lazyPage(CartPage) },
      { path: 'wishlist', element: lazyPage(WishlistPage) },
      { path: 'checkout', element: <ProtectedRoute>{lazyPage(CheckoutPage)}</ProtectedRoute> },
      { path: 'payment', element: <ProtectedRoute>{lazyPage(PaymentPage)}</ProtectedRoute> },
      { path: 'orders', element: <ProtectedRoute>{lazyPage(OrdersPage)}</ProtectedRoute> },
      { path: 'orders/:id', element: <ProtectedRoute>{lazyPage(OrderDetailPage)}</ProtectedRoute> },
      { path: 'account', element: <ProtectedRoute>{lazyPage(AccountPage)}</ProtectedRoute> },
      { path: 'login', element: lazyPage(LoginPage) },
      { path: 'register', element: lazyPage(RegisterPage) },
      { path: 'forgot-password', element: lazyPage(ForgotPasswordPage) },
      { path: 'reset-password/:token', element: lazyPage(ResetPasswordPage) },
    ],
  },
  // Admin lives in its own shell (AdminLayout) — deliberately NOT nested under
  // the storefront <Layout>, so admins never see the customer Header/cart/etc.
  {
    path: '/admin',
    element: <AdminRoute>{lazyPage(AdminLayout)}</AdminRoute>,
    children: [
      { index: true, element: lazyPage(AdminDashboardPage) },
      { path: 'products', element: lazyPage(AdminProductsPage) },
      { path: 'orders', element: lazyPage(AdminOrdersPage) },
      { path: 'customers', element: lazyPage(AdminCustomersPage) },
      { path: 'coupons', element: lazyPage(AdminCouponsPage) },
      { path: 'store-owners', element: lazyPage(StoreOwnersPage) },
      { path: 'managers', element: lazyPage(ManagersPage) },
      { path: 'activity', element: lazyPage(AuditTrailPage) },
    ],
  },
]);
