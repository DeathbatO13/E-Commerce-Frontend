import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import OrdersApp from './OrdersApp'
import './index.css'

/**
 * Bootstrap standalone — solo para desarrollo aislado.
 * Propósito: Renderizar el microfrontend directamente en el DOM para pruebas fuera del Shell.
 * Se monta bajo `/orders/*`, igual que en el Shell, porque las páginas navegan con rutas absolutas.
 *
 * @returns {void}
 * @throws {Error} Si no encuentra el elemento con id 'root'
 * @sideeffects Modifica el DOM montando la aplicación React
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/orders/*" element={<OrdersApp />} />
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
