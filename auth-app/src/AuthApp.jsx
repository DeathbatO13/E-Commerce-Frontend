/**
 * AuthApp — Microfrontend de Autenticación
 * Expuesto vía Module Federation como: authApp/AuthApp
 * Puerto: 5001
 */
function AuthApp() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-5">🔐</div>
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">Auth App</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Módulo de autenticación — Login, Registro y gestión de sesión (JWT).
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Module Federation
          </span>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            Puerto 5001
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            🚧 En desarrollo
          </span>
        </div>
        <div className="mt-8 border-t border-indigo-100 pt-6 text-left space-y-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Rutas pendientes</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
            <code>/login</code>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
            <code>/register</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthApp
