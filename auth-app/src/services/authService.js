const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081'
const TOKEN_KEY = 'ecommerce.accessToken'

/** Evento emitido cada vez que cambia la sesión local. */
export const AUTH_SESSION_EVENT = 'ecommerce:auth-session-change'

/**
 * Función login
 * Propósito: Iniciar sesión en el backend y obtener el token JWT.
 * 
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Correo del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<{ accessToken: string, tokenType: string, expiresIn: number }>} Promesa con los datos de sesión
 * @throws {Error} Si las credenciales son inválidas o falla la red
 * @sideeffects Realiza petición HTTP POST a /auth/login
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
 * Función register
 * Propósito: Registrar un nuevo usuario en el sistema.
 * 
 * @param {Object} payload - Datos del nuevo usuario
 * @param {string} payload.fullName - Nombre completo
 * @param {string} payload.email - Correo electrónico
 * @param {string} payload.password - Contraseña
 * @returns {Promise<void>} Promesa que se resuelve si el registro es exitoso
 * @throws {Error} Si los datos son inválidos o el usuario ya existe
 * @sideeffects Realiza petición HTTP POST a /auth/register
 */
export async function register({ email, password, fullName }) {
  const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      fullName,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Error al crear la cuenta");
  }
}

// ── Token helpers ──────────────────────────────────────────────────────────

/**
 * Guarda el token de acceso en el almacenamiento local.
 * Propósito: Persistir la sesión del usuario en el navegador.
 * 
 * @param {string} accessToken - Token JWT proporcionado por el backend
 * @returns {void}
 * @throws {None}
 * @sideeffects Escribe en localStorage
 */
export function saveToken(accessToken) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  notifySessionChange()
}

/**
 * Recupera el token de acceso del almacenamiento local.
 * Propósito: Obtener el token guardado para enviarlo en las cabeceras HTTP.
 * 
 * @returns {string | null} El token JWT o null si no existe
 * @throws {None}
 * @sideeffects Lee de localStorage
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Elimina el token de acceso del almacenamiento local.
 * Propósito: Cerrar la sesión del usuario localmente.
 * 
 * @returns {void}
 * @throws {None}
 * @sideeffects Elimina un ítem de localStorage
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  notifySessionChange()
}

/**
 * Verifica si existe una sesión activa.
 * Propósito: Determinar rápidamente si el usuario tiene un token almacenado.
 * 
 * @returns {boolean} True si hay un token, false en caso contrario
 * @throws {None}
 * @sideeffects Lee de localStorage indirectamente
 */
export function isAuthenticated() {
  return !!getToken() && !isTokenExpired()
}

/**
 * Decodifica el payload de un token JWT sin verificar la firma.
 * Propósito: Extraer información pública del token (como el rol o el ID del usuario).
 * 
 * @param {string} [token] - Token JWT a decodificar (si no se envía, busca en localStorage)
 * @returns {Object | null} El payload decodificado o null si el token es inválido
 * @throws {None} Captura excepciones internamente y devuelve null
 * @sideeffects Ninguno (excepto si llama a getToken())
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

/**
 * Obtiene el rol del usuario a partir del token JWT.
 * Propósito: Facilitar la verificación de permisos en la UI.
 * 
 * @returns {string | null} El rol del usuario ('CLIENT', 'ADMIN', 'SUPER_ADMIN') o null
 * @throws {None}
 * @sideeffects Ninguno
 */
export function getRole() {
  const payload = decodeToken()
  return payload?.role ?? null
}

/**
 * Determina si el JWT actual ya venció.
 *
 * @param {string} [token] - JWT a comprobar; si no se indica se usa la sesión actual
 * @returns {boolean} True si el token tiene una fecha de expiración pasada
 * @sideeffects Ninguno
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token)
  return Boolean(payload?.exp && payload.exp * 1000 <= Date.now())
}

/**
 * Devuelve la información pública disponible de la sesión local.
 *
 * @returns {{ isAuthenticated: boolean, role: string | null, token: string | null }} Estado actual de la sesión
 * @sideeffects Elimina un token vencido del almacenamiento local
 */
export function getSession() {
  const token = getToken()

  if (token && isTokenExpired(token)) {
    removeToken()
    return { isAuthenticated: false, role: null, token: null }
  }

  return {
    isAuthenticated: Boolean(token),
    role: token ? getRole() : null,
    token,
  }
}

/**
 * Cierra la sesión local del usuario.
 *
 * @returns {void}
 * @sideeffects Elimina el JWT y notifica a los microfrontends que escuchen el evento de sesión
 */
export function logout() {
  removeToken()
}

/**
 * Publica el estado de sesión para que el Shell y otros remotos puedan sincronizarse.
 *
 * @returns {void}
 * @sideeffects Emite un CustomEvent en window
 */
function notifySessionChange() {
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: getSession() }))
}
