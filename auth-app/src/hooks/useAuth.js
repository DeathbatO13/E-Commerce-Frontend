import { useState } from 'react'
import { login, register, saveToken } from '../services/authService'

// ── useLogin ─────────────────────────────────────────────────────────────

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

export function useRegister({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleRegister({ fullname, email, password }) {
    setLoading(true)
    setError(null)
    try {
      await register({ fullname, email, password })
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { handleRegister, loading, error }
}
