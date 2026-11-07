import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'

/**
 * Componente CatalogApp.
 * Propósito: Exponer el punto de entrada del microfrontend de catálogo al Shell.
 * El Shell le delega las rutas que no son suyas, así que le indica qué mostrar si ninguna coincide.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.notFound=null] - Contenido para rutas desconocidas
 * @returns {JSX.Element} Aplicación de catálogo con sus propias subrutas
 * @sideeffects Ninguno
 */
function CatalogApp({ notFound = null }) {
  return (
    <div className="catalog-app-shell">
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={notFound} />
      </Routes>
    </div>
  )
}

export default CatalogApp