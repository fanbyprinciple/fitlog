import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the app under /fitlog/. Local dev keeps the same
// base so router URLs match the deployed surface.
export default defineConfig({
  plugins: [react()],
  base: '/fitlog/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
