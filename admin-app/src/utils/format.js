/**
 * @fileoverview Formateo de montos, fechas y estados para el panel de administración.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dateFormatter = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

/** Etiquetas en español de `OrderStatus`. */
export const ORDER_STATUS_LABELS = {
  CREATED: 'Pendiente de pago',
  PAID: 'Pagado',
  CANCELLED: 'Cancelado',
};

/** Etiquetas en español de los roles. */
export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super admin',
  ADMIN: 'Administrador',
  CLIENT: 'Cliente',
};

/**
 * Formatea un monto en dólares (misma moneda que el resto de microfrontends).
 *
 * @param {number} value - Monto
 * @returns {string} Monto formateado
 */
export function formatCurrency(value) {
  return currencyFormatter.format(value ?? 0);
}

/**
 * Formatea una fecha `LocalDateTime` del backend (sin zona, se interpreta como hora local).
 *
 * @param {string} value - Fecha ISO
 * @returns {string} Fecha legible o cadena vacía si no es válida
 */
export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

/**
 * Acorta un UUID para mostrarlo como identificador.
 *
 * @param {string} id - UUID
 * @returns {string} Primeros 8 caracteres en mayúscula
 */
export function shortId(id) {
  return String(id).slice(0, 8).toUpperCase();
}
