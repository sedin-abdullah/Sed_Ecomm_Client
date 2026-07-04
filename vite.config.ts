import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // SPA fallback: serve index.html for any navigation the SW intercepts
        // so React Router can handle the route client-side.
        navigateFallback: '/index.html',
        // Never cache API responses - they must always hit the network.
        navigateFallbackDenylist: [/^\/api\//],
        // Bypass SW entirely for API requests to prevent stale data.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/sed-ecomm-api\.onrender\.com\/.*/,
            handler: 'NetworkOnly',
          },
        ],
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
  build: {
    // Split large dependencies into their own chunks so the browser
    // caches them separately and only downloads what changed on updates.
    rollupOptions: {
      output: {
        manualChunks: {
          // React core stays together (used on every page)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Data fetching layer
          'query-vendor': ['@tanstack/react-query', 'axios'],
          // i18n libraries (large, but only needed for translations)
          'i18n-vendor': ['i18next', 'react-i18next'],
          // Animation / motion libraries (if used)
          'motion-vendor': ['framer-motion'],
          // Icon library
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Increase warning limit since we've split intentionally
    chunkSizeWarningLimit: 800,
  },
});
