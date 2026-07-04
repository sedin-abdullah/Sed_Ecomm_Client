import type { SyntheticEvent } from 'react';

/**
 * Neutral inline-SVG placeholder shown when a product image fails to load.
 * Inlined as a data URI so the fallback itself can never 404.
 */
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Cg fill='none' stroke='%239ca3af' stroke-width='8'%3E%3Crect x='130' y='140' width='140' height='110' rx='8'/%3E%3Ccircle cx='168' cy='178' r='14'/%3E%3Cpath d='M150 240l40-40 30 26 26-20 34 34'/%3E%3C/g%3E%3Ctext x='200' y='300' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";

/**
 * `onError` handler for product `<img>` tags. Swaps in the placeholder once,
 * guarding against an infinite error loop if the fallback itself somehow fails.
 */
export function handleImageError(e: SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';
  img.src = FALLBACK_IMAGE;
}
