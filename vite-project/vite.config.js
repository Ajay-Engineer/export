import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://rebecca-backendfinal.appspot.com'
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
      },
      '/uploads': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://rebecca-backendfinal.appspot.com'
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
      }
    },
  },
})
