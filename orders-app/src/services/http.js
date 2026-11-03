/**
 * @fileoverview Utilidades HTTP compartidas por los servicios de Orders App.
 * Propósito: Adjuntar el JWT de la sesión y traducir las respuestas de error del backend
 * (`ErrorResponse { status, error, message, timestamp }`) a un `Error` usable por la UI.
 */

import { getToken } from 'authApp/authService';

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
 * Las respuestas sin cuerpo (201 o 200 sin JSON) se resuelven como `null`.
 *
 * @param {Response} response - Respuesta de Fetch
 * @param {string} fallbackMessage - Mensaje de error por defecto
 * @returns {Promise<unknown>} Cuerpo JSON de la respuesta o null
 * @throws {Error} Si la respuesta no es exitosa
 * @sideeffects Consume el cuerpo de la respuesta
 */
export async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
    }
    if (response.status === 403) {
      throw new Error('No tienes permiso para ver este pedido.');
    }
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}
