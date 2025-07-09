import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        void: resolve(__dirname, 'void/index.html'),
        clearLode: resolve(__dirname, 'clear-lode/index.html'),
        datascape: resolve(__dirname, 'datascape/index.html'),
        incarnation: resolve(__dirname, 'incarnation/index.html'),
        limbo: resolve(__dirname, 'limbo/index.html'),
      }
    }
  },
  server: {
    port: 8888,
  },
  // Ensure audio worklets are copied to dist
  publicDir: 'public'
})