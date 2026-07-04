import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// TODO(pwa-stage): vite-plugin-pwa is installed and wired with a minimal manifest
// reference below. The dedicated PWA stage should flesh out real icon assets,
// a runtime caching strategy (workbox `runtimeCaching` rules for the API and
// image CDN), and offline fallback page.
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Manifest is also declared statically at public/manifest.webmanifest and
      // linked from index.html. We keep injection minimal here for this stage;
      // the PWA stage can switch `manifest: false` off and let this generate it,
      // or extend `includeAssets` / `workbox` options below.
      manifest: false,
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: {
        // TODO(pwa-stage): define real runtimeCaching + navigateFallback once
        // real routes/assets exist.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
