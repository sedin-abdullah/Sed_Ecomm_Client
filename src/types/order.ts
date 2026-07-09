import type { Address } from './user';
import type { SelectedVariant } from './product';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  id: string;
  // Orders snapshot the product's name/image/price at purchase time; `product`
  // is just the referenced id, not a populated product document.
  product: string;
  name: string;
  image?: string;
  variant?: SelectedVariant;
  qty: number;
  price: number;
}

export interface OrderTrackingEvent {
  status: OrderStatus | string;
  label: string;
  timestamp: string;
  note?: string;
}

export type RefundMethod = 'card' | 'upi' | 'cash';

export interface RefundInfo {
  status: 'requested' | 'processed';
  reason: string;
  comments?: string;
  requestedAt: string;
  method?: RefundMethod;
  processedAt?: string;
  processedBy?: string;
  message?: string;
}

export interface Order {
  id: string;
  // Admin listing populates the customer (name/email); absent on a user's own orders.
  user?: { id?: string; name?: string; email?: string; phone?: string };
  items: OrderItem[];
  // The API populates `shippingAddress` (not `address`).
  shippingAddress?: Address;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus?: string;
  couponCode?: string;
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  total: number;
  currency: string;
  trackingTimeline?: OrderTrackingEvent[];
  refund?: RefundInfo;
  cancelledBy?: string;
  cancellationReason?: string;
  // Attached by the admin refunds endpoint only.
  payment?: { id: string; method: string; status: string; amount: number };
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  minItems?: number; // cart must hold at least this many items; 0 = no minimum
}
