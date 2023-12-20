import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true, // 允许websocket代理
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/image': {
        target: 'https://sm.ms/api/v2/upload',
        changeOrigin: true,
        ws: true, // 允许websocket代理
        rewrite: (path) => path.replace(/^\/image/, '')
      }
    }
  }
})
