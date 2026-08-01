import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import Input         from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button        from '../components/ui/Button'
import Alert         from '../components/ui/Alert'

const MIN_PASSWORD_LENGTH = 6
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Componente RegisterPage — Vista principal para registro de usuarios.
 * Propósito: Renderizar el formulario de creación de cuenta y gestionar sus validaciones y estado.
 * 
 * @returns {JSX.Element} Formulario de registro de cuenta
 * @throws {None}
 * @sideeffects Interactúa con `useRegister` para lanzar la petición de red y navegar en caso de éxito.
 */
function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  })

  const [validationError, setValidationError] = useState(null)

  const { handleRegister, loading, error } = useRegister({
    onSuccess: () => navigate('/login'),
  })

  function updateField(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    if (!form.fullName.trim())
      return 'Ingresa un nombre completo.'
    if (!EMAIL_PATTERN.test(form.email.trim()))
      return 'Ingresa un correo electrónico válido.'
    if (form.password.length < MIN_PASSWORD_LENGTH)
      return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    if (form.password !== form.confirmPassword)
      return 'Las contraseñas no coinciden.'
    return null
  }

  function onSubmit(e) {
    e.preventDefault()
    setValidationError(null)

    const validationMsg = validate()
    if (validationMsg) {
      setValidationError(validationMsg)
      return
    }

    handleRegister({
      fullName: form.fullName.trim(),
      email:    form.email.trim(),
      password: form.password,
    })
  }

  const displayError = validationError || error

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Crear cuenta</h1>

      {displayError && <Alert>{displayError}</Alert>}

      <Input
        label="Nombre completo"
        id="reg-name"
        type="text"
        autoComplete="name"
        placeholder="Juan Pérez"
        value={form.fullName}
        onChange={updateField('fullName')}
        required
      />

      <Input
        label="Email"
        id="reg-email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        value={form.email}
        onChange={updateField('email')}
        required
      />

      <PasswordInput
        label="Contraseña"
        id="reg-password"
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        value={form.password}
        onChange={updateField('password')}
        required
      />

      <PasswordInput
        label="Confirmar contraseña"
        id="reg-confirm"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        value={form.confirmPassword}
        onChange={updateField('confirmPassword')}
        required
      />

      <Button id="btn-register" type="submit" loading={loading}>
        Crear cuenta
      </Button>

      <p className="auth-terms">
        Al registrarte aceptas nuestros{' '}
        <button type="button" className="link">
          Términos y condiciones
        </button>
      </p>
    </form>
  )
}

export default RegisterPage
