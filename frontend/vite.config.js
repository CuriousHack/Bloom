import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the SW
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Bloom Cooperative Savings',
        short_name: 'Bloom',
        description: 'Track your cooperative contributions seamlessly.',
        theme_color: '#FDFDF5', // Bloom Cream (for browser UI)
        background_color: '#6D4C41', // Bloom Brown (for splash screen)
        display: 'standalone', // Standalone app window (no browser bar)
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Used by Android adaptive icons
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Cache all core assets
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'), // Cache API requests
            handler: 'NetworkFirst', // Prioritize network, fallback to cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      }
    })
  ]
});