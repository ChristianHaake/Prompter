import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function productionContentSecurityPolicy(): string {
  const headersPath = resolve(dirname(fileURLToPath(import.meta.url)), 'public/_headers');
  const match = readFileSync(headersPath, 'utf8').match(/^\s*Content-Security-Policy:\s*(.+)$/m);
  if (!match) {
    throw new Error(`Content-Security-Policy not found in ${headersPath}`);
  }
  return match[1].trim();
}

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
      manifest: {
        name: 'Prompter',
        short_name: 'Prompter',
        description: 'Browserbasierter Teleprompter für deine Pitches.',
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f3f5f8',
        theme_color: '#245dcc',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,woff2}'],
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
    strictPort: true,
    headers: {
      'Content-Security-Policy': productionContentSecurityPolicy().replace(
        /;\s*upgrade-insecure-requests\s*/i,
        '',
      )
    }
  }
});
