import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import Input        from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button       from '../components/ui/Button'
import Alert        from '../components/ui/Alert'
import Divider      from '../components/ui/Divider'
import GoogleButton from '../components/ui/GoogleButton'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Componente LoginPage — Vista principal para inicio de sesión.
 * Propósito: Renderizar el formulario de login y gestionar sus validaciones locales.
 * 
 * @returns {JSX.Element} Formulario de inicio de sesión
 * @throws {None}
 * @sideeffects Interactúa con `useLogin` para lanzar la petición de red y, en caso de éxito, navegar a la ruta de origen (`state.from`) o a `/`.
 */
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState(null)

  const { handleLogin, loading, error } = useLogin({
    // Vuelve a la página que pidió el login (la guarda el ProtectedRoute del Shell en state.from)
    onSuccess: () => navigate(location.state?.from?.pathname || '/', { replace: true }),
  })

  function onSubmit(e) {
    e.preventDefault()
    setValidationError(null)

    if (!EMAIL_PATTERN.test(email.trim())) {
      setValidationError('Ingresa un correo electrónico válido.')
      return
    }

    if (!password) {
      setValidationError('Ingresa tu contraseña.')
      return
    }

    handleLogin({ email: email.trim(), password })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Iniciar Sesión</h1>

      {(validationError || error) && <Alert>{validationError || error}</Alert>}

      <Input
        label="Email"
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <PasswordInput
        label="Contraseña"
        id="login-password"
        autoComplete="current-password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        hint={
          <button type="button" className="link-sm">
            ¿Olvidaste tu contraseña?
          </button>
        }
      />

      <Button id="btn-login" type="submit" loading={loading}>
        Iniciar Sesión
      </Button>

      <Divider />

      <GoogleButton />
    </form>
  )
}

export default LoginPage
