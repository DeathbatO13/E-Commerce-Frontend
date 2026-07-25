import { useNavigate } from 'react-router-dom'

/**
 * AuthLayout — Layout dividido: panel azul (izq) + panel blanco (der).
 *
 * @param {'login' | 'register'} activeTab
 * @param {ReactNode}            children   — Formulario activo
 */
function AuthLayout({ children, activeTab }) {
  const navigate = useNavigate()

  const copy = {
    login: {
      heading: 'Bienvenido de nuevo',
      body: 'Tu tienda de confianza para encontrar los mejores productos. Inicia sesión para continuar.',
    },
    register: {
      heading: 'Únete a nosotros',
      body: 'Crea tu cuenta y empieza a disfrutar de los mejores productos al mejor precio.',
    },
  }

  const tabs = [
    { key: 'login',    label: 'Iniciar Sesión', id: 'tab-login',    path: '/login' },
    { key: 'register', label: 'Registrarse',    id: 'tab-register', path: '/register' },
  ]

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Panel izquierdo ── */}
        <aside className="auth-panel-left">
          <div className="auth-logo">
            <span aria-hidden="true">🛒</span>
            <span>E-commerce</span>
          </div>

          <div>
            <h2 className="auth-panel-heading">{copy[activeTab].heading}</h2>
            <p className="auth-panel-body">{copy[activeTab].body}</p>
          </div>

          <p className="auth-panel-footer">
            © {new Date().getFullYear()} E-commerce. Todos los derechos reservados.
          </p>
        </aside>

        {/* ── Panel derecho ── */}
        <section className="auth-panel-right">
          {/* Tabs */}
          <nav className="auth-tabs" aria-label="Modo de acceso">
            {tabs.map(tab => (
              <button
                key={tab.key}
                id={tab.id}
                onClick={() => navigate(tab.path)}
                className={`auth-tab ${activeTab === tab.key ? 'auth-tab-active' : 'auth-tab-inactive'}`}
                aria-current={activeTab === tab.key ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Formulario inyectado */}
          <div className="flex-1">
            {children}
          </div>
        </section>

      </div>
    </div>
  )
}

export default AuthLayout
