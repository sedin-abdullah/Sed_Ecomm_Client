import type { Product, SelectedVariant } from './product';

export interface CartItem {
  id: string;
  product: Product;
  variant?: SelectedVariant;
  qty: number;
  savedForLater?: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  couponCode?: string;
  total: number;
  currency: string;
}
