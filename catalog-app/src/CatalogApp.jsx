/**
 * CatalogApp — Microfrontend de Catálogo de Productos
 * Expuesto vía Module Federation como: catalogApp/CatalogApp
 * Puerto: 5002
 */
function CatalogApp() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-5">🛍️</div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">Catalog App</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Catálogo de productos — Listado, filtros por categoría y vista de detalle.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Module Federation
          </span>
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
            Puerto 5002
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            🚧 En desarrollo
          </span>
        </div>
        <div className="mt-8 border-t border-emerald-100 pt-6 text-left space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Rutas pendientes</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
            <code>/</code> — Listado de productos
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
            <code>/products/:id</code> — Detalle
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogApp
