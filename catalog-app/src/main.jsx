import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CatalogApp from './CatalogApp'
import './index.css'

// Bootstrap standalone — solo para desarrollo aislado
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogApp />
    </BrowserRouter>
  </React.StrictMode>,
)
