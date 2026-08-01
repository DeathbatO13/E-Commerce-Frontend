/**
 * Componente AdminApp — Microfrontend de Administración.
 * Propósito: Renderizar el panel de administración central del sistema.
 * Expuesto vía Module Federation como: adminApp/AdminApp
 * Puerto: 5005
 * 
 * @returns {JSX.Element} Interfaz del panel de administración
 * @throws {None}
 * @sideeffects Ninguno
 */
function AdminApp() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-5">⚙️</div>
        <h2 className="text-2xl font-bold text-rose-800 mb-2">Admin App</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Panel de administración — Gestión de productos, categorías, pedidos y usuarios.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Module Federation
          </span>
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
            Puerto 5005
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 ADMIN / SUPER_ADMIN
          </span>
        </div>
        <div className="mt-8 border-t border-rose-100 pt-6 text-left space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Rutas pendientes</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-rose-300 inline-block" />
            <code>/admin/products</code>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-rose-300 inline-block" />
            <code>/admin/orders</code>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-rose-300 inline-block" />
            <code>/admin/users</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminApp
