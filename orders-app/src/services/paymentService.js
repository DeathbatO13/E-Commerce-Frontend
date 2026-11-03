/**
 * @fileoverview Servicio de pagos simulados.
 * Propósito: Consumir el Payment Service (`docs/openapi/payment.yaml`). El pago es un mock: se puede
 * forzar el resultado con `simulateResult`. Si es `APPROVED`, el backend marca el pedido como `PAID`;
 * si es `REJECTED`, el pedido sigue en `CREATED` y se puede reintentar.
 */

import { authHeaders, parseResponse } from './http';

const PAYMENT_BASE_URL = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8085';

/**
 * Procesa el pago de un pedido.
 *
 * @param {Object} payload - Datos del pago
 * @param {string} payload.orderId - UUID del pedido (debe estar en `CREATED`)
 * @param {number} payload.amount - Monto; debe ser exactamente el total del pedido
 * @param {'APPROVED'|'REJECTED'} [payload.simulateResult] - Resultado forzado; si se omite se aprueba
 * @returns {Promise<{ id: string, orderId: string, amount: number, status: 'APPROVED'|'REJECTED', transactionId: string, createdAt: string }>} Pago registrado
 * @throws {Error} Si el monto no coincide (400), el pedido no está pendiente (409) o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /payments/process
 */
export async function processPayment({ orderId, amount, simulateResult }) {
  const response = await fetch(`${PAYMENT_BASE_URL}/payments/process`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ orderId, amount, simulateResult }),
  });
  return parseResponse(response, 'No fue posible procesar el pago.');
}
