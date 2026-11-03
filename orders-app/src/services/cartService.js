/**
 * @fileoverview Lectura del carrito para el checkout.
 * Propósito: Mostrar el resumen antes de crear el pedido. Solo lee (`GET /cart`); las escrituras
 * del carrito son responsabilidad de Cart App. Se llama directo a la API en lugar de importar
 * `cartApp`, para no acoplar los dos remotos.
 */

import { authHeaders, parseResponse } from './http';

const CART_BASE_URL = import.meta.env.VITE_CART_API_URL || 'http://localhost:8083';

/** El carrito cambió. Debe coincidir con `CART_UPDATED` de `shell/src/core/events/eventBus.js`. */
const CART_UPDATED = 'ecommerce:cart-updated';

/**
 * Obtiene el carrito activo del usuario autenticado.
 *
 * @returns {Promise<{ userId: string, items: Array<{ productId: string, quantity: number, price: number }>, total: number }>} Carrito actual
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /cart
 */
export async function getCart() {
  const response = await fetch(`${CART_BASE_URL}/cart`, { headers: authHeaders() });
  return parseResponse(response, 'No fue posible cargar el carrito.');
}

/**
 * Avisa al Shell que el carrito quedó vacío (el backend lo vacía al crear el pedido).
 *
 * @returns {void}
 * @sideeffects Dispara un CustomEvent en window
 */
export function emitCartCleared() {
  window.dispatchEvent(new CustomEvent(CART_UPDATED, { detail: { itemCount: 0 } }));
}
