import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Las variables VITE_* se leen del .env de la raíz del monorepo (ver .env.example)
const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT_DIR)

  return {
    envDir: ROOT_DIR,
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          authApp:    env.VITE_AUTH_REMOTE_URL    || 'http://localhost:5001/assets/remoteEntry.js',
          catalogApp: env.VITE_CATALOG_REMOTE_URL || 'http://localhost:5002/assets/remoteEntry.js',
          cartApp:    env.VITE_CART_REMOTE_URL    || 'http://localhost:5003/assets/remoteEntry.js',
          ordersApp:  env.VITE_ORDERS_REMOTE_URL  || 'http://localhost:5004/assets/remoteEntry.js',
          adminApp:   env.VITE_ADMIN_REMOTE_URL   || 'http://localhost:5005/assets/remoteEntry.js',
        },
        exposes: {
          './TopNavBar': './src/shared/components/TopNavBar.jsx',
          './Footer':    './src/shared/components/Footer.jsx',
          './eventBus':  './src/core/events/eventBus.js',
        },
        shared: ['react', 'react-dom', 'react-router-dom'],
      }),
    ],
    server: {
      port: 5000,
      strictPort: true,
    },
    build: {
      target: 'esnext',
    },
  }
})
