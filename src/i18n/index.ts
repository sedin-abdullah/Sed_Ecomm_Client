import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ta from './locales/ta/translation.json';
import hi from './locales/hi/translation.json';
import ar from './locales/ar/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import es from './locales/es/translation.json';
import zh from './locales/zh/translation.json';
import ja from './locales/ja/translation.json';
import ml from './locales/ml/translation.json';
import te from './locales/te/translation.json';
import kn from './locales/kn/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்', dir: 'ltr' },
  { code: 'ml', label: 'മലയാളം', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు', dir: 'ltr' },
  { code: 'kn', label: 'ಕನ್ನಡ', dir: 'ltr' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const RTL_LANGUAGES: readonly string[] = SUPPORTED_LANGUAGES.filter((l) => l.dir === 'rtl').map(
  (l) => l.code,
);

export function isRtl(code: string): boolean {
  return RTL_LANGUAGES.includes(code);
}

/** Applies the correct `dir` attribute to <html> for the given language. */
export function applyDocumentDirection(code: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dir = isRtl(code) ? 'rtl' : 'ltr';
  document.documentElement.lang = code;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      hi: { translation: hi },
      ar: { translation: ar },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      zh: { translation: zh },
      ja: { translation: ja },
      ml: { translation: ml },
      te: { translation: te },
      kn: { translation: kn },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sed-ecomm-language',
    },
  });

i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng);
});

// Set the initial direction as soon as the module loads (covers the case
// where the detected language resolves before the first render).
applyDocumentDirection(i18n.language);

export default i18n;
