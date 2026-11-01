import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Config compartida por las 6 apps: `eslint .` dentro de cada workspace sube hasta este archivo.
export default defineConfig([
  globalIgnores(['**/dist', '**/node_modules', '.turbo']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Archivos de configuración (Vite, Tailwind, PostCSS, ESLint): se ejecutan en Node, no en el navegador
    files: ['*.config.js', '**/*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
