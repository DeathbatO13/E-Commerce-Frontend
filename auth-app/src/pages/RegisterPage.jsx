import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [validationError, setValidationError] = useState(null)

  const { handleRegister, loading, error } = useRegister({
    onSuccess: () => navigate('/login'),
  })

  function onChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    setValidationError(null)

    if (form.password !== form.confirmPassword) {
      setValidationError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    handleRegister({
      fullName: form.fullName,
      email:    form.email,
      password: form.password,
    })
  }

  const displayError = validationError || error

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Crear cuenta</h1>

      {/* Error */}
      {displayError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {displayError}
        </div>
      )}

      {/* Nombre completo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-name" className="text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          placeholder="Juan Pérez"
          value={form.fullName}
          onChange={onChange('fullName')}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={onChange('email')}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Contraseña */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={onChange('password')}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            type="button"
            aria-label={showPwd ? 'Ocultar' : 'Mostrar'}
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showPwd
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.03-3.374M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.21 5.442M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Confirmar contraseña */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-confirm" className="text-sm font-medium text-gray-700">
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={onChange('confirmPassword')}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            type="button"
            aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showConfirm
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.03-3.374M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.21 5.442M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        id="btn-register"
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm mt-1"
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className="text-xs text-center text-gray-400">
        Al registrarte aceptas nuestros{' '}
        <button type="button" className="text-blue-500 hover:underline">Términos y condiciones</button>
      </p>
    </form>
  )
}

export default RegisterPage
