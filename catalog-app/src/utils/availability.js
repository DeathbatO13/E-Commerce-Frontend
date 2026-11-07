/**
 * @fileoverview Disponibilidad de un producto para la venta.
 * Propósito: Unificar el criterio en el listado, el detalle y el filtro "In Stock Only".
 * `active` indica si el producto está habilitado (regla 3.2) y `stock` cuántas unidades quedan: solo se
 * puede comprar si está habilitado y tiene stock.
 */

/**
 * Calcula si un producto se puede comprar y qué etiqueta mostrar.
 *
 * @param {{ active: boolean, stock?: number }} product - Producto
 * @returns {{ purchasable: boolean, label: string }} Disponibilidad
 */
export function getAvailability(product) {
  if (!product.active) return { purchasable: false, label: 'Unavailable' }
  if (!(product.stock > 0)) return { purchasable: false, label: 'Out of Stock' }
  return { purchasable: true, label: 'In Stock' }
}
