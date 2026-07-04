import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADJECTIVES, NOUNS, CATEGORIES, DESCRIPTION_TEMPLATE, type ProductLang } from '@/i18n/productTerms';
import type { Product } from '@/types';

const SUPPORTED: ProductLang[] = ['en', 'ta', 'hi', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];

function normalizeLang(lang: string | undefined): ProductLang {
  const base = (lang ?? 'en').split('-')[0];
  return SUPPORTED.includes(base as ProductLang) ? (base as ProductLang) : 'en';
}

/**
 * Translates a composed "Adjective Noun" product name. Falls back to the
 * original text for anything not in the fixed vocabulary (e.g. admin-created
 * products), so nothing ever renders blank.
 */
export function translateProductName(name: string, lang: ProductLang): string {
  if (lang === 'en' || !name) return name;
  const parts = name.trim().split(/\s+/);
  const adj = parts[0];
  const noun = parts.slice(1).join(' ');
  const tAdj = ADJECTIVES[adj]?.[lang];
  const tNoun = NOUNS[noun]?.[lang];
  if (!tAdj && !tNoun) return name;
  return `${tAdj ?? adj} ${tNoun ?? noun}`.trim();
}

export function translateCategoryName(name: string | undefined, lang: ProductLang): string {
  if (!name || lang === 'en') return name ?? '';
  return CATEGORIES[name]?.[lang] ?? name;
}

export function translateProductDescription(product: Pick<Product, 'name' | 'description' | 'brand' | 'tags'>, lang: ProductLang): string {
  if (lang === 'en') return product.description;
  const parts = product.name.trim().split(/\s+/);
  const adj = parts[0];
  const noun = parts.slice(1).join(' ');
  const tAdj = ADJECTIVES[adj]?.[lang];
  const tNoun = NOUNS[noun]?.[lang];
  // Only synthesize a translated description when we recognize the vocabulary;
  // otherwise keep the stored (English) description rather than a broken mix.
  if (!tAdj || !tNoun) return product.description;

  const parentTag = product.tags?.[0];
  const parentKey = parentTag ? Object.keys(CATEGORIES).find((k) => k.toLowerCase() === parentTag) : undefined;
  const category = parentKey ? CATEGORIES[parentKey]?.[lang] ?? parentKey : '';

  return DESCRIPTION_TEMPLATE[lang]
    .replace('{adjective}', tAdj)
    .replace('{noun}', tNoun.toLowerCase())
    .replace('{brand}', product.brand ?? '')
    .replace('{category}', category.toLowerCase());
}

/** Reactive translator bound to the current UI language; re-memoizes on change. */
export function useProductI18n() {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  return useMemo(
    () => ({
      lang,
      name: (p: Pick<Product, 'name'>) => translateProductName(p.name, lang),
      rawName: (name: string) => translateProductName(name, lang),
      category: (name: string | undefined) => translateCategoryName(name, lang),
      description: (p: Pick<Product, 'name' | 'description' | 'brand' | 'tags'>) =>
        translateProductDescription(p, lang),
    }),
    [lang],
  );
}
