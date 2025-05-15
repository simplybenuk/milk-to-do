
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate', // Changed back to 'autoUpdate' from 'prompt'
      includeAssets: [
        'favicon.ico', 
        'pwa-192x192.png', 
        'pwa-512x512.png', 
        'milk_logo192.png', 
        'milk_logo512.png',
        'sourlist-logo.png',
        'og-image.png',
        'sw-modules/cache-manager.js',
        'sw-modules/notification-manager.js',
        'sw-modules/message-handler.js'
      ],
      manifest: {
        name: 'SourList - The Expiring To-Do App',
        short_name: 'SourList',
        description: 'A to-do app where tasks go sour after 30 days. Keep your tasks fresh and your priorities clear.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: /^https:\/\/vtkjlrftizocaqhbsyts\.supabase\.co/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 1 day
            },
            networkTimeoutSeconds: 10
          }
        }],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true, // Always enable in development
        type: 'module',
        navigateFallback: 'index.html',
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
