import { useLocation } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './index.css'

/**
 * Componente AuthApp — Punto de entrada del Microfrontend de Autenticación.
 * Propósito: Renderizar la ruta correcta (Login o Registro) dependiendo del URL actual montándolo dentro del AuthLayout.
 * Expuesto vía Module Federation como: authApp/AuthApp.
 *
 * @returns {JSX.Element} La página envuelta en su Layout de autenticación
 * @throws {None}
 * @sideeffects Lee la ruta de la aplicación anfitriona (shell) usando useLocation()
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
