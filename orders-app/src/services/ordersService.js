/**
 * @fileoverview Servicio de pedidos.
 * Propósito: Consumir el Order Service (`docs/openapi/order.yaml`). Todas las rutas requieren sesión.
 * Un CLIENT solo ve sus pedidos; ADMIN y SUPER_ADMIN ven todos.
 */

import { authHeaders, parseResponse } from './http';

const ORDER_BASE_URL = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8084';

/**
 * @typedef {Object} Order
 * @property {string} id - UUID del pedido
 * @property {string} userId - UUID del dueño
 * @property {'CREATED'|'PAID'|'CANCELLED'} status - Estado del pedido
 * @property {Array<{ productId: string, quantity: number, price: number }>} items - Ítems con el precio congelado
 * @property {number} total - Total del pedido
 * @property {string} createdAt - Fecha de creación (ISO local, sin zona horaria)
 */

/**
 * Crea un pedido a partir del carrito actual del usuario.
 * El backend copia los ítems del carrito, valida precios contra el catálogo y vacía el carrito.
 *
 * Responde 201 sin cuerpo y con el id en la cabecera `Location: /orders/{id}`. Si el backend no expone
 * esa cabecera por CORS (`Access-Control-Expose-Headers`), el navegador no la deja leer; en ese caso se
 * busca el pedido `CREATED` más reciente del usuario, que es el que se acaba de crear.
 *
 * @param {string} address - Dirección de envío (obligatoria)
 * @returns {Promise<string>} ID del pedido creado
 * @throws {Error} Si el carrito está vacío, un producto cambió o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /orders (y GET /orders si no puede leer `Location`)
 */
export async function createOrder(address) {
  const response = await fetch(`${ORDER_BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ address }),
  });
  await parseResponse(response, 'No fue posible crear el pedido.');

  const location = response.headers.get('Location');
  const idFromLocation = location?.split('/').filter(Boolean).pop();
  if (idFromLocation) return idFromLocation;

  const latest = (await getOrders())
    .filter(order => order.status === 'CREATED')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  if (!latest) {
    throw new Error('El pedido se creó, pero no fue posible recuperarlo. Revísalo en "Mis pedidos".');
  }
  return latest.id;
}

/**
 * Lista los pedidos visibles para el usuario autenticado.
 *
 * @returns {Promise<Order[]>} Pedidos
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /orders
 */
export async function getOrders() {
  const response = await fetch(`${ORDER_BASE_URL}/orders`, { headers: authHeaders() });
  return (await parseResponse(response, 'No fue posible cargar tus pedidos.')) ?? [];
}

/**
 * Obtiene un pedido por su ID.
 *
 * @param {string} id - UUID del pedido
 * @returns {Promise<Order>} Pedido
 * @throws {Error} Si no existe (404), pertenece a otro usuario (403) o el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /orders/{id}
 */
export async function getOrderById(id) {
  const response = await fetch(`${ORDER_BASE_URL}/orders/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  return parseResponse(response, 'No fue posible cargar el pedido.');
}

/**
 * Cancela un pedido (regla 4.3: solo si no está pagado).
 *
 * @param {string} id - UUID del pedido
 * @returns {Promise<void>}
 * @throws {Error} Si el pedido ya está pagado (409), no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /orders/{id}/cancel
 */
export async function cancelOrder(id) {
  const response = await fetch(`${ORDER_BASE_URL}/orders/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    headers: authHeaders(),
  });
  await parseResponse(response, 'No fue posible cancelar el pedido.');
}
