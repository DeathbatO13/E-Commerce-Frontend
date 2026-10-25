import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Las variables VITE_* se leen del .env de la raíz del monorepo (ver .env.example)
const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT_DIR)

  return {
    envDir: ROOT_DIR,
    plugins: [
      react(),
      federation({
        name: 'catalog-app',
        filename: 'remoteEntry.js',
        remotes: {
          shellApp: env.VITE_SHELL_REMOTE_URL || 'http://localhost:5000/assets/remoteEntry.js',
          authApp:  env.VITE_AUTH_REMOTE_URL  || 'http://localhost:5001/assets/remoteEntry.js',
        },
        exposes: {
          './CatalogApp': './src/CatalogApp.jsx',
        },
        shared: ['react', 'react-dom', 'react-router-dom'],
      }),
    ],
    server: {
      port: 5002,
      strictPort: true,
    },
    preview: {
      port: 5002,
      strictPort: true,
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
  }
})
