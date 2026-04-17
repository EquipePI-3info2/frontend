import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Redireciona /api/* para o backend Django em desenvolvimento
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Redireciona /media/* para o backend (imagens de produtos)
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
