/**
 * @fileoverview Bus de eventos centralizado para comunicación entre Microfrontends.
 * Propósito: Proveer un canal de comunicación tipado usando CustomEvents nativos del navegador,
 * sin requerir librerías externas ni romper la independencia entre remotos.
 *
 * Patrón: Emit / On / Off sobre `window`.
 * Los remotos emiten eventos. El Shell y otros remotos interesados los escuchan.
 *
 * @module eventBus
 */

// ── Nombres de eventos (constantes tipadas) ─────────────────────────────────

/**
 * Evento emitido cuando el usuario agrega un producto al carrito.
 * Payload: `{ productId: string, quantity: number }`
 * @type {string}
 */
export const CART_ADD_ITEM = 'ecommerce:cart-add-item'

/**
 * Evento emitido cuando cambia la sesión del usuario (login / logout).
 * Re-exportado desde authService para tener un único punto de verdad.
 * Payload: `{ isAuthenticated: boolean, role: string | null, token: string | null }`
 * @type {string}
 */
export const AUTH_SESSION_CHANGE = 'ecommerce:auth-session-change'

// ── API del bus ──────────────────────────────────────────────────────────────

/**
 * Emite un evento tipado en el bus global.
 *
 * @param {string} eventName - Nombre del evento (usar las constantes exportadas)
 * @param {Object} [payload={}] - Datos asociados al evento
 * @returns {void}
 * @sideeffects Dispara un CustomEvent en window
 */
export function emit(eventName, payload = {}) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: payload }))
}

/**
 * Suscribe un handler a un evento del bus.
 * Devuelve una función de limpieza para remover la suscripción.
 *
 * @param {string} eventName - Nombre del evento a escuchar
 * @param {function(CustomEvent): void} handler - Función a ejecutar cuando se recibe el evento
 * @returns {function(): void} Función de cleanup para remover el listener
 * @sideeffects Agrega un listener en window
 */
export function on(eventName, handler) {
  window.addEventListener(eventName, handler)
  return () => window.removeEventListener(eventName, handler)
}

/**
 * Remueve un handler específico de un evento del bus.
 *
 * @param {string} eventName - Nombre del evento
 * @param {function} handler - El mismo handler que se pasó a `on()`
 * @returns {void}
 * @sideeffects Remueve un listener de window
 */
export function off(eventName, handler) {
  window.removeEventListener(eventName, handler)
}
