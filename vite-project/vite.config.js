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
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://rebecca-exim-api.herokuapp.com'
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://rebecca-exim-api.herokuapp.com'
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
      }
    },
  },
})
