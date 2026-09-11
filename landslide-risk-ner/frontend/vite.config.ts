import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Build output goes to dist/ — Vercel reads this via outputDirectory in vercel.json
  build: {
    outDir: 'dist',
    // Generate source maps for easier debugging in production
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
    // Dev proxy: forwards /api/* to the local FastAPI backend.
    // In production (Vercel), /api/* is handled by the serverless function — no proxy needed.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
