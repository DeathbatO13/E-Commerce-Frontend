import { useNavigate } from 'react-router-dom'

/** Layout dividido: panel azul izquierdo + panel blanco derecho */
function AuthLayout({ children, activeTab }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl flex rounded-2xl overflow-hidden shadow-2xl">

        {/* ── Panel izquierdo (azul) ── */}
        <div className="hidden md:flex flex-col justify-between w-5/12 bg-blue-500 text-white p-10">
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span className="text-2xl">🛒</span>
            <span>E-commerce</span>
          </div>

          {/* Mensaje central */}
          <div>
            <h2 className="text-3xl font-bold leading-snug mb-3">
              {activeTab === 'login' ? 'Bienvenido de nuevo' : 'Únete a nosotros'}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              {activeTab === 'login'
                ? 'Tu tienda de confianza para encontrar los mejores productos. Inicia sesión para continuar.'
                : 'Crea tu cuenta y empieza a disfrutar de los mejores productos al mejor precio.'}
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-blue-200">
            © {new Date().getFullYear()} E-commerce. Todos los derechos reservados.
          </p>
        </div>

        {/* ── Panel derecho (blanco) ── */}
        <div className="flex-1 bg-white p-10 flex flex-col">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8 self-center w-full max-w-xs">
            <button
              id="tab-login"
              onClick={() => navigate('/login')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              id="tab-register"
              onClick={() => navigate('/register')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Contenido (form) inyectado */}
          <div className="flex-1">{children}</div>
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
