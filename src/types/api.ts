/**
 * Shared response envelope types mirroring docs/API_CONTRACT.md.
 *
 * Every backend response follows:
 *   { success: boolean, data?: T, message?: string, errors?: ApiError[] }
 *
 * List endpoints additionally return a `pagination` object alongside `data`.
 * Keep these in sync with the contract — everything else in the app should
 * import from here rather than redefining response shapes.
 */

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

/** Standard query params accepted by every paginated list endpoint. */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'popular'
  | 'rating';
