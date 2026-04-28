import { useLocation } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './index.css'

/**
 * AuthApp — Microfrontend de Autenticación
 * Expuesto vía Module Federation como: authApp/AuthApp
 *
 * El Shell enruta /login y /register a este componente.
 * Usamos useLocation() para determinar qué tab/página mostrar.
 */
function AuthApp() {
  const { pathname } = useLocation()
  const activeTab = pathname === '/register' ? 'register' : 'login'

  return (
    <AuthLayout activeTab={activeTab}>
      {activeTab === 'register' ? <RegisterPage /> : <LoginPage />}
    </AuthLayout>
  )
}

export default AuthApp
