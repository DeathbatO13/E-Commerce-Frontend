import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        authApp:    'http://localhost:5001/assets/remoteEntry.js',
        catalogApp: 'http://localhost:5002/assets/remoteEntry.js',
        cartApp:    'http://localhost:5003/assets/remoteEntry.js',
        ordersApp:  'http://localhost:5004/assets/remoteEntry.js',
        adminApp:   'http://localhost:5005/assets/remoteEntry.js',
      },
      exposes: {
        './TopNavBar': './src/shared/components/TopNavBar.jsx',
        './Footer': './src/shared/components/Footer.jsx'
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
})
