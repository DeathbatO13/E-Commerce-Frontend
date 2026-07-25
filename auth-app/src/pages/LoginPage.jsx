import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import Input        from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button       from '../components/ui/Button'
import Alert        from '../components/ui/Alert'
import Divider      from '../components/ui/Divider'
import GoogleButton from '../components/ui/GoogleButton'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const { handleLogin, loading, error } = useLogin({
    onSuccess: () => navigate('/'),
  })

  function onSubmit(e) {
    e.preventDefault()
    handleLogin({ email, password })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Iniciar Sesión</h1>

      {error && <Alert>{error}</Alert>}

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
