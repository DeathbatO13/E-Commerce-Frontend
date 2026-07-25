const AUTH_BASE_URL = 'http://localhost:8081'

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ accessToken: string, tokenType: string, expiresIn: number }}
 */
export async function login({ email, password }) {
  const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Credenciales inválidas')
  }

  return data // { accessToken, tokenType, expiresIn }
}

/**
 * POST /auth/register
 * @param {{ fullname: string, email: string, password: string }} payload
 */
export async function register({ email, password, fullname }) {
  const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      fullname,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Error al crear la cuenta");
  }
}

// ── Token helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = 'mySuperSecretKey12345678901234567890123456789012'

export function saveToken(accessToken) {
  localStorage.setItem(TOKEN_KEY, accessToken)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

/**
 * Decode JWT payload without verifying signature.
 * Returns null if token is missing or malformed.
 */
export function decodeToken(token) {
  try {
    const base64Url = (token || getToken()).split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function getRole() {
  const payload = decodeToken()
  return payload?.role ?? null
}
