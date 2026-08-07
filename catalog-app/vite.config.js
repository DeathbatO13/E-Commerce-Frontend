import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog-app',
      filename: 'remoteEntry.js',
      remotes: {
        shellApp: 'http://localhost:5000/assets/remoteEntry.js',
        authApp:  'http://localhost:5001/assets/remoteEntry.js',
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
})
