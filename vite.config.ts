import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Prompter',
        short_name: 'Prompter',
        description: 'Teleprompter-App ohne Login und ohne Tracking.',
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f3f5f8',
        theme_color: '#245dcc',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      }
    })
  ],
  server: {
    port: 5180,
    strictPort: true
  },
  preview: {
    port: 5180,
    strictPort: true
  }
});
