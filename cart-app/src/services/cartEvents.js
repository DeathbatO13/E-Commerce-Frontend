/**
 * @fileoverview Eventos del carrito entre microfrontends.
 * Propósito: Escuchar y publicar eventos sobre `window` sin importar `shellApp/eventBus`,
 * para no crear una dependencia circular shell ↔ cart (mismo enfoque que `authService`).
 * Los nombres deben coincidir con las constantes de `shell/src/core/events/eventBus.js`.
 */

/** Un microfrontend pide agregar un producto. Payload: `{ productId: string, quantity: number }` */
export const CART_ADD_ITEM = 'ecommerce:cart-add-item';

/** El carrito cambió en el backend. Payload: `{ itemCount: number }` (suma de cantidades) */
export const CART_UPDATED = 'ecommerce:cart-updated';

/**
 * Publica la cantidad total de unidades del carrito para que el Shell actualice su badge.
 *
 * @param {Array<{ quantity: number }>} items - Ítems del carrito
 * @returns {void}
 * @sideeffects Dispara un CustomEvent en window
 */
export function emitCartUpdated(items) {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  window.dispatchEvent(new CustomEvent(CART_UPDATED, { detail: { itemCount } }));
}
