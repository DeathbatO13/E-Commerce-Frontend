import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CatalogApp from './CatalogApp'
import './index.css'

/**
 * Bootstrap standalone — solo para desarrollo aislado.
 * Propósito: Renderizar el microfrontend directamente en el DOM para pruebas fuera del Shell.
 * 
 * @returns {void}
 * @throws {Error} Si no encuentra el elemento con id 'root'
 * @sideeffects Modifica el DOM montando la aplicación React
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogApp />
    </BrowserRouter>
  </React.StrictMode>,
)
