/**
 * Componente CartApp — Microfrontend del Carrito de Compras.
 * Propósito: Gestionar y visualizar los ítems agregados al carrito temporal del usuario.
 * Expuesto vía Module Federation como: cartApp/CartApp
 * Puerto: 5003
 * 
 * @returns {JSX.Element} Interfaz de usuario del carrito
 * @throws {None}
 * @sideeffects Ninguno
 */
function CartApp() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-5">🛒</div>
        <h2 className="text-2xl font-bold text-orange-800 mb-2">Cart App</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Carrito de compras — Gestión de ítems, cantidades y resumen de pedido.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Module Federation
          </span>
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            Puerto 5003
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            🚧 En desarrollo
          </span>
        </div>
        <div className="mt-8 border-t border-orange-100 pt-6 text-left space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Rutas pendientes</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-orange-300 inline-block" />
            <code>/cart</code> — Vista del carrito
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartApp
