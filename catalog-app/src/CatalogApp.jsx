import CatalogPage from './pages/CatalogPage'

/**
 * Componente CatalogApp.
 * Propósito: Exponer el punto de entrada del microfrontend de catálogo al Shell.
 *
 * @returns {JSX.Element} Página principal del catálogo
 * @sideeffects Ninguno
 */
function CatalogApp() {
  return (
    <div className="catalog-app-shell">
      <CatalogPage />
    </div>
  )
}

export default CatalogApp