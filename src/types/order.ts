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

export interface Order {
  id: string;
  items: OrderItem[];
  address: Address;
  status: OrderStatus;
  paymentMethod: string;
  couponCode?: string;
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  total: number;
  currency: string;
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
}
