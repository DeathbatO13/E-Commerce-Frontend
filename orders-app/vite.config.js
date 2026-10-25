import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Las variables VITE_* se leen del .env de la raíz del monorepo (ver .env.example)
const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  envDir: ROOT_DIR,
  plugins: [
    react(),
    federation({
      name: 'orders-app',
      filename: 'remoteEntry.js',
      exposes: {
        './OrdersApp': './src/OrdersApp.jsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: {
    port: 5004,
    strictPort: true,
  },
  preview: {
    port: 5004,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
