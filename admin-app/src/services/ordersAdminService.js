/**
 * @fileoverview Pedidos de todos los usuarios (Order Service).
 * Propósito: Con rol `ADMIN` o `SUPER_ADMIN`, `GET /orders` devuelve los pedidos de todos los usuarios
 * (regla 6.1) y `POST /orders/{id}/cancel` permite cancelar cualquiera que no esté pagado.
 */

import { request } from './http';

const ORDER_BASE_URL = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8084';

/**
 * Lista todos los pedidos.
 *
 * @returns {Promise<Array<{ id: string, userId: string, status: 'CREATED'|'PAID'|'CANCELLED', items: Array<Object>, total: number, createdAt: string }>>} Pedidos
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /orders
 */
export async function getAllOrders() {
  return (await request(`${ORDER_BASE_URL}/orders`, { errorMessage: 'No fue posible cargar los pedidos.' })) ?? [];
}

/**
 * Cancela un pedido no pagado.
 *
 * @param {string} id - UUID del pedido
 * @returns {Promise<void>}
 * @throws {Error} Si el pedido ya está pagado (409), no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /orders/{id}/cancel
 */
export async function cancelOrder(id) {
  await request(`${ORDER_BASE_URL}/orders/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    errorMessage: 'No fue posible cancelar el pedido.',
  });
}
