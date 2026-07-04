import { describe, it, expect } from 'vitest';
import { translateProductName, translateCategoryName, translateProductDescription } from './productI18n';

describe('translateProductName', () => {
  it('returns the original name for English', () => {
    expect(translateProductName('Deluxe Sneakers', 'en')).toBe('Deluxe Sneakers');
  });

  it('translates a known "Adjective Noun" name', () => {
    // "Deluxe" + "Sneakers" both exist in the vocabulary for Hindi.
    const out = translateProductName('Deluxe Sneakers', 'hi');
    expect(out).not.toBe('Deluxe Sneakers');
    expect(out.split(' ').length).toBeGreaterThanOrEqual(2);
  });

  it('handles multi-word nouns like "Power Bank"', () => {
    const out = translateProductName('Classic Power Bank', 'fr');
    expect(out).toContain('Batterie externe');
  });

  it('falls back to the original for unknown (admin-created) names', () => {
    expect(translateProductName('Zzz Widget', 'hi')).toBe('Zzz Widget');
  });
});

describe('translateCategoryName', () => {
  it('translates a known category', () => {
    expect(translateCategoryName('Footwear', 'fr')).toBe('Chaussures');
  });
  it('passes through unknown categories', () => {
    expect(translateCategoryName('Gadgets', 'fr')).toBe('Gadgets');
  });
});

describe('translateProductDescription', () => {
  const product = {
    name: 'Deluxe Sneakers',
    description: 'A great English description here.',
    brand: 'Strydon',
    tags: ['footwear', 'sneakers', 'strydon'],
  };

  it('returns the stored description for English', () => {
    expect(translateProductDescription(product, 'en')).toBe(product.description);
  });

  it('synthesizes a translated description for a known product, keeping the brand', () => {
    const out = translateProductDescription(product, 'fr');
    expect(out).not.toBe(product.description);
    expect(out).toContain('Strydon');
  });

  it('keeps the original description when the vocabulary is unknown', () => {
    const unknown = { ...product, name: 'Zzz Widget' };
    expect(translateProductDescription(unknown, 'fr')).toBe(product.description);
  });
});
