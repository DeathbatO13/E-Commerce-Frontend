import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'

/**
 * Componente CatalogApp.
 * Propósito: Exponer el punto de entrada del microfrontend de catálogo al Shell.
 *
 * @returns {JSX.Element} Aplicación de catálogo con sus propias subrutas
 * @sideeffects Ninguno
 */
function CatalogApp() {
  return (
    <div className="catalog-app-shell">
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  )
}

export default CatalogApp