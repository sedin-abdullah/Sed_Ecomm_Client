import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Coupon, Order, PaginatedResponse, Product, User } from '@/types';

export interface DashboardSummary {
  totalSales: number;
  dailySales: number;
  monthlySales: number;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<DashboardSummary>>('/admin/dashboard/summary');
      return res.data.data!;
    },
  });
}

export function useBestSellingProducts() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'best-sellers'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Array<{ product: Product; unitsSold: number }>>>(
        '/admin/dashboard/best-sellers',
      );
      return res.data.data ?? [];
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      // includeInactive so the admin table also shows disabled products.
      const res = await apiClient.get<PaginatedResponse<Product>>('/products', {
        params: { limit: 50, includeInactive: true },
      });
      return res.data.data ?? [];
    },
  });
}

/** Lightweight enable/disable toggle (JSON PATCH, no multipart form). */
export function useSetProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await apiClient.patch(`/products/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      // Refresh both the admin table and every customer-facing product view
      // (listing rails, detail pages) so catalog edits propagate immediately,
      // even within a single tab where refetch-on-focus wouldn't fire.
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export interface ProductFormPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  discountPrice?: number;
  sizes?: string;
  colors?: string;
  tags?: string;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  imageFiles?: File[];
}

/** Multer + the multipart form body is the only way to attach image files, so
 * every product write goes through FormData rather than a JSON payload. */
function buildProductFormData(payload: ProductFormPayload): FormData {
  const formData = new FormData();
  const { imageFiles, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
  });

  imageFiles?.forEach((file) => formData.append('images', file));

  return formData;
}

// NOTE: no explicit Content-Type here — apiClient's request interceptor
// detects the FormData body and drops the default JSON Content-Type so the
// browser sets `multipart/form-data` with the correct boundary.
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductFormPayload) => {
      const res = await apiClient.post<ApiResponse<Product>>('/products', buildProductFormData(payload));
      return res.data.data!;
    },
    onSuccess: () => {
      // Refresh both the admin table and every customer-facing product view
      // (listing rails, detail pages) so catalog edits propagate immediately,
      // even within a single tab where refetch-on-focus wouldn't fire.
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProductFormPayload }) => {
      const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, buildProductFormData(payload));
      return res.data.data!;
    },
    onSuccess: () => {
      // Refresh both the admin table and every customer-facing product view
      // (listing rails, detail pages) so catalog edits propagate immediately,
      // even within a single tab where refetch-on-focus wouldn't fire.
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<Order>>('/admin/orders', { params: { limit: 50 } });
      return res.data.data ?? [];
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiClient.patch(`/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResponse<User>>('/admin/customers', { params: { limit: 50 } });
      return res.data.data ?? [];
    },
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupons');
      return res.data.data ?? [];
    },
  });
}

export interface CreateCouponPayload {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit?: number;
  isActive?: boolean;
  minItems?: number; // cart must hold at least this many items; 0 = no minimum
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCouponPayload) => {
      const res = await apiClient.post<ApiResponse<Coupon>>('/coupons', payload);
      return res.data.data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<CreateCouponPayload> }) => {
      const res = await apiClient.patch<ApiResponse<Coupon>>(`/coupons/${id}`, patch);
      return res.data.data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/coupons/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  });
}
