import { useEffect, useState } from 'react'
import {
  AUTH_SESSION_EVENT,
  getSession,
  login,
  logout,
  register,
  saveToken,
} from '../services/authService'

// ── useLogin ─────────────────────────────────────────────────────────────

/**
 * Hook custom useLogin
 * Propósito: Encapsular la lógica de estado y la petición asíncrona para iniciar sesión.
 *
 * @param {Object} options - Opciones de configuración del hook
 * @param {function} [options.onSuccess] - Callback ejecutado tras un inicio de sesión exitoso
 * @returns {{ handleLogin: function, loading: boolean, error: string | null }} Objeto con estado y handler
 * @throws {None} Errores atrapados internamente y reflejados en el estado `error`
 * @sideeffects Realiza llamada HTTP a la API y persiste el token si es exitoso
 */
export function useLogin({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleLogin({ email, password }) {
    setLoading(true)
    setError(null)
    try {
      const data = await login({ email, password })
      saveToken(data.accessToken)
      onSuccess?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, error }
}

// ── useRegister ───────────────────────────────────────────────────────────

/**
 * Hook custom useRegister
 * Propósito: Encapsular la lógica de estado y la petición asíncrona para registrar un usuario.
 *
 * @param {Object} options - Opciones de configuración del hook
 * @param {function} [options.onSuccess] - Callback ejecutado tras un registro exitoso
 * @returns {{ handleRegister: function, loading: boolean, error: string | null }} Objeto con estado y handler
 * @throws {None} Errores atrapados internamente y reflejados en el estado `error`
 * @sideeffects Realiza llamada HTTP a la API
 */
export function useRegister({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleRegister({ fullName, email, password }) {
    setLoading(true)
    setError(null)
    try {
      await register({ fullName, email, password })
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { handleRegister, loading, error }
}

/**
 * Hook custom useAuthSession.
 * Propósito: Exponer el estado de autenticación, rol y cierre de sesión a cualquier consumidor federado.
 *
 * @returns {{ session: { isAuthenticated: boolean, role: string | null, token: string | null }, logout: function }} Sesión reactiva y acción para cerrarla
 * @sideeffects Escucha eventos globales de cambio de sesión mientras está montado
 */
export function useAuthSession() {
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    function updateSession(event) {
      setSession(event.detail || getSession())
    }

    window.addEventListener(AUTH_SESSION_EVENT, updateSession)
    return () => window.removeEventListener(AUTH_SESSION_EVENT, updateSession)
  }, [])

  return { session, logout }
}
