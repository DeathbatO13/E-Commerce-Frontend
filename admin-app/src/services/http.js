/**
 * @fileoverview Utilidades HTTP compartidas por los servicios de Admin App.
 * Propósito: Adjuntar el JWT de la sesión y traducir las respuestas de error del backend
 * (`ErrorResponse { status, error, message, timestamp }`) a un `Error` usable por la UI.
 */

import { getToken, logout } from 'authApp/authService';

/**
 * Construye las cabeceras con el JWT de la sesión actual.
 *
 * @param {Object} [extra={}] - Cabeceras adicionales
 * @returns {Object} Cabeceras para fetch
 * @sideeffects Lee el token de localStorage (vía authApp)
 */
export function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

/**
 * Convierte una respuesta HTTP a JSON o lanza un error usable por la UI.
 * Las respuestas sin cuerpo (200 o 204) se resuelven como `null`.
 *
 * @param {Response} response - Respuesta de Fetch
 * @param {string} fallbackMessage - Mensaje de error por defecto
 * @returns {Promise<unknown>} Cuerpo JSON de la respuesta o null
 * @throws {Error} Si la respuesta no es exitosa
 * @sideeffects Consume el cuerpo de la respuesta; en 401 cierra la sesión (el Shell redirige a `/login`)
 */
export async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
    }
    if (response.status === 403) {
      throw new Error('No tienes permiso para realizar esta acción.');
    }
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

/**
 * Envía una petición JSON autenticada y devuelve el cuerpo ya interpretado.
 *
 * @param {string} url - URL completa
 * @param {Object} options - Opciones
 * @param {string} [options.method='GET'] - Método HTTP
 * @param {Object} [options.body] - Cuerpo a serializar como JSON
 * @param {string} options.errorMessage - Mensaje si el backend no envía uno
 * @returns {Promise<unknown>} Cuerpo JSON o null
 * @throws {Error} Si la respuesta no es exitosa
 * @sideeffects Realiza una petición HTTP
 */
export async function request(url, { method = 'GET', body, errorMessage }) {
  const response = await fetch(url, {
    method,
    headers: authHeaders(body ? { 'Content-Type': 'application/json' } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse(response, errorMessage);
}
