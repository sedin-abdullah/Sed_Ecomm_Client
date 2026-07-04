# Sed_Ecomm — Client

Premium e-commerce frontend built with React 18, TypeScript, Vite, Tailwind CSS,
Framer Motion, React Router v6, Axios, TanStack Query, React Hook Form + Zod,
i18next, and Zustand.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

Make sure `VITE_API_URL` in `.env` points at a running instance of the
Sed_Ecomm API (defaults to `http://localhost:5000/api/v1`, see
`../docs/API_CONTRACT.md`). The app builds and runs fine without the backend
for this foundation stage — network calls simply fail gracefully.

## Scripts

| Command           | Description                                   |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the Vite dev server                      |
| `npm run build`    | Type-check (`tsc -b`) and produce a prod build |
| `npm run preview`  | Preview the production build locally           |
| `npm run lint`     | Run ESLint                                      |
| `npm run test`     | Run Vitest (unit/component tests)              |

## Project structure

```
src/
  app/            Root App, router, and provider composition
  components/
    ui/           Design-system primitives (Button, Card, Modal, ...)
    layout/       Header, Footer, MobileBottomNav, PageTransition, Layout
  features/       Empty per-domain scaffolds (auth, products, cart, ...)
                  for later stages — each has components/hooks/pages
  lib/
    api/          Axios client with auth + refresh-token interceptors
    utils.ts      cn() class-merge helper
  store/          Zustand stores: auth, theme, cart count, toast
  hooks/          Generic hooks: useMediaQuery, useDebounce
  types/          Shared TypeScript types mirroring the API contract
  i18n/           i18next config + per-locale translation.json files
  styles/         Tailwind layers + CSS variable design tokens
  pages/          Temporary placeholder routes for this foundation stage
```

## Design system

See `tailwind.config.ts` and `src/styles/index.css` for the full token set:

- **Colors** — CSS-variable-driven HSL scales for `brand` (deep indigo/navy),
  `accent` (teal), and `gold` (sparing highlight, e.g. rating stars), plus
  semantic `success/warning/danger/info` and theme-aware
  `background/surface/foreground/border/muted` tokens. Light and dark themes
  swap the variable values only — class names never change.
- **Type scale** — `Plus Jakarta Sans` for display/headings, `Inter` for body
  text, with tightened letter-spacing at larger sizes for a confident,
  editorial feel.
- **Shadows** — `shadow-soft` / `shadow-elevated` / `shadow-premium` /
  `shadow-glow`: soft, multi-layer, low-opacity shadows rather than hard drop
  shadows. Blur is used sparingly as an accent on overlays (modals, drawers,
  the sticky nav), never as the dominant visual language.
  - **Radius** — `rounded-2xl` (`1.5rem`) is the default card radius; a full
  `sm → 3xl` scale is available.

Visit `/design-system` in the running app for a live showcase of every UI
primitive in both themes.

## PWA

`vite-plugin-pwa` is installed and wired with a minimal, functional
`autoUpdate` configuration and a static `public/manifest.webmanifest`.
Icons are placeholder SVGs (`public/icons/icon.svg`) — a dedicated PWA stage
should generate real multi-resolution PNGs and flesh out `workbox`
runtime-caching rules. See the `TODO(pwa-stage)` comments in
`vite.config.ts` and `index.html`.

## Internationalization

`en` has the full, hand-written string set. All other locales
(`ta`, `hi`, `ar`, `fr`, `de`, `es`, `zh`, `ja`, `ml`, `te`, `kn`) mirror the
same keys with best-effort machine translations so the UI never falls back to
raw i18n keys — a professional localization pass can replace these later.
`ar` is wired for RTL: selecting it flips `dir="rtl"` on `<html>`.
