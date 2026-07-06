import type { Category } from './category';

export interface ProductVariants {
  sizes: string[];
  colors: string[];
}

export interface SelectedVariant {
  size?: string;
  color?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  category: Category | string;
  images: ProductImage[];
  price: number;
  /** The current sale price when the product is discounted — lower than `price`, not a strikethrough comparison price. */
  discountPrice?: number;
  currency: string;
  rating: number;
  numReviews: number;
  stock: number;
  variants?: ProductVariants;
  tags?: string[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string;
  size?: string;
  color?: string;
  inStock?: boolean;
  onSale?: boolean;
  flashSale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  search?: string;
}

export interface ProductFacets {
  brands: string[];
  sizes: string[];
  colors: string[];
}

export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  image?: string;
}
