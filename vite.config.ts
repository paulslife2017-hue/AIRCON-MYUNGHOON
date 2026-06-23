import { defineConfig } from 'vite'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig({
  plugins: [pages({
    excludePatterns: ['/static/*', '/gallery/*', '/og-image.jpg', '/robots.txt', '/sitemap.xml']
  })],
  build: {
    outDir: 'dist'
  }
})
