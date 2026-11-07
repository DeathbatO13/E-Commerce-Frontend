/**
 * @fileoverview Servicio del carrito de compras.
 * Propósito: Consumir el Cart Service (`docs/openapi/cart.yaml`). Todas las rutas requieren sesión,
 * por lo que cada llamada envía el JWT del usuario en la cabecera Authorization.
 */

import { getToken, logout } from 'authApp/authService';

const CART_BASE_URL = import.meta.env.VITE_CART_API_URL || 'http://localhost:8083';

/**
 * Obtiene el carrito activo del usuario autenticado.
 * El backend crea el carrito automáticamente en el primer uso (regla 3.1).
 *
 * @returns {Promise<{ userId: string, items: Array<{ productId: string, quantity: number, price: number }>, total: number }>} Carrito actual
 * @throws {Error} Si no hay sesión o el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /cart
 */
export async function getCart() {
  const response = await fetch(`${CART_BASE_URL}/cart`, { headers: authHeaders() });
  return parseResponse(response, 'No fue posible cargar el carrito.');
}

/**
 * Agrega un producto al carrito (si ya existe, el backend suma la cantidad).
 *
 * @param {Object} payload - Producto a agregar
 * @param {string} payload.productId - ID del producto
 * @param {number} [payload.quantity=1] - Cantidad a agregar (mínimo 1)
 * @returns {Promise<void>}
 * @throws {Error} Si el producto no existe, está deshabilitado o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /cart/items
 */
export async function addCartItem({ productId, quantity = 1 }) {
  const response = await fetch(`${CART_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ productId, quantity }),
  });
  await parseResponse(response, 'No fue posible agregar el producto al carrito.');
}

/**
 * Actualiza la cantidad de un ítem en el carrito.
 *
 * @param {string} productId - ID del producto
 * @param {number} quantity - Nueva cantidad (mínimo 1)
 * @returns {Promise<void>}
 * @throws {Error} Si el ítem no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP PUT a /cart/items/{productId}
 */
export async function updateCartItem(productId, quantity) {
  const response = await fetch(`${CART_BASE_URL}/cart/items/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ quantity }),
  });
  await parseResponse(response, 'No fue posible actualizar la cantidad.');
}

/**
 * Elimina un ítem del carrito.
 *
 * @param {string} productId - ID del producto
 * @returns {Promise<void>}
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP DELETE a /cart/items/{productId}
 */
export async function removeCartItem(productId) {
  const response = await fetch(`${CART_BASE_URL}/cart/items/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await parseResponse(response, 'No fue posible eliminar el producto.');
}

/**
 * Vacía el carrito del usuario.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP DELETE a /cart
 */
export async function clearCart() {
  const response = await fetch(`${CART_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await parseResponse(response, 'No fue posible vaciar el carrito.');
}

/**
 * Construye las cabeceras con el JWT de la sesión actual.
 *
 * @param {Object} [extra={}] - Cabeceras adicionales
 * @returns {Object} Cabeceras para fetch
 * @sideeffects Lee el token de localStorage (vía authApp)
 */
function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

/**
 * Convierte una respuesta HTTP a JSON o lanza un error usable por la UI.
 * Las respuestas sin cuerpo (204, o 200 sin JSON) se resuelven como `null`.
 *
 * @param {Response} response - Respuesta de Fetch
 * @param {string} fallbackMessage - Mensaje de error por defecto
 * @returns {Promise<unknown>} Cuerpo JSON de la respuesta o null
 * @throws {Error} Si la respuesta no es exitosa
 * @sideeffects Consume el cuerpo de la respuesta; en 401 cierra la sesión (el Shell redirige a `/login`)
 */
async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
    }
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}
