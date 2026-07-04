import { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

/**
 * Extracts a human-readable message from a failed API call — the first
 * field-level validation error, then the response `message`, then a fallback.
 * Lets UI surface *why* a request failed instead of a generic error.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.errors?.length) return data.errors[0].message;
    if (data?.message) return data.message;
  }
  return fallback;
}
