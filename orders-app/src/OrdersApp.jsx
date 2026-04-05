/**
 * OrdersApp — Microfrontend de Pedidos y Pagos
 * Expuesto vía Module Federation como: ordersApp/OrdersApp
 * Puerto: 5004
 */
function OrdersApp() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-5">📦</div>
        <h2 className="text-2xl font-bold text-sky-800 mb-2">Orders App</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Pedidos y pagos — Checkout, historial de órdenes y estado de envíos.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Module Federation
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            Puerto 5004
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            🚧 En desarrollo
          </span>
        </div>
        <div className="mt-8 border-t border-sky-100 pt-6 text-left space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Rutas pendientes</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-sky-300 inline-block" />
            <code>/orders</code> — Historial
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-sky-300 inline-block" />
            <code>/orders/:id</code> — Detalle
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-sky-300 inline-block" />
            <code>/checkout</code> — Pago
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersApp
