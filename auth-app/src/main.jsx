import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthApp from './AuthApp'
import './index.css'

// Bootstrap standalone — solo para desarrollo aislado
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthApp />
    </BrowserRouter>
  </React.StrictMode>,
)
