import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'app.png'],
      manifest: {
        name: 'AscendVia',
        short_name: 'AscendVia',
        description: 'AscendVia - Custom Websites and Portfolio Solutions',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})


// Name: <input type="text" placeholder='Enter a Name' />
// Email: <input type="text" placeholder='Enter a Email' />
// Expiriance: <input type="text" placeholder='Enter a Expiriance' />
// Skills: <input type="text" placeholder='Enter a skills' />
// Education: <input type="text" placeholder='Enter a Education' />
// Projects-name: <input type="text" placeholder='Enter a Projects-name' />
// Projects-Discription-Links:<textarea name="" id="">Projects-Discription-Links</textarea>


