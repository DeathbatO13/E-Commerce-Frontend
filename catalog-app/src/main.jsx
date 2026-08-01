import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link } from 'react-router-dom'
import CatalogApp from './CatalogApp.jsx'
import './index.css'

/**
 * Punto de entrada local (standalone).
 * Propósito: Renderizar el catálogo con un header local y un diseño consistente.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="layout-wrapper">
        <header className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black">ReactStore</span>
              <nav className="hidden gap-4 text-sm font-medium text-slate-700 md:flex">
                <Link to="/" className="text-slate-900">Home</Link>
                <Link to="/categories" className="text-slate-600 hover:text-slate-900">Categories</Link>
                <Link to="/about" className="text-slate-600 hover:text-slate-900">About Us</Link>
              </nav>
            </div>
            <div className="hidden items-center gap-3 text-sm text-slate-600 md:flex">
              <button className="rounded-full border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-100">Sign in</button>
              <button className="rounded-full bg-slate-900 px-3 py-2 text-white hover:bg-slate-800">Cart</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <CatalogApp />
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
