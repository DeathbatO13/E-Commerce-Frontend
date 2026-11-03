import { useState, useEffect } from 'react';
import { getOrderById, cancelOrder } from '../services/ordersService';
import { processPayment } from '../services/paymentService';
import { enrichItems } from '../services/productService';

/**
 * Carga un pedido y le agrega el nombre de cada producto.
 *
 * @param {string} id - UUID del pedido
 * @returns {Promise<Object>} Pedido listo para la UI
 * @throws {Error} Si el Order Service falla
 * @sideeffects Peticiones HTTP al Order y Catalog Service
 */
async function loadOrder(id) {
  const order = await getOrderById(id);
  return { ...order, items: await enrichItems(order?.items ?? []) };
}

/**
 * Hook custom useOrder.
 * Propósito: Gestionar un pedido (detalle, cancelación y pago simulado).
 * Después de cada acción se vuelve a pedir el pedido, porque el backend responde sin cuerpo
 * y es quien decide el nuevo estado.
 *
 * @param {string} id - UUID del pedido
 * @returns {{
 *   order: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   cancel: function(): Promise<void>,
 *   pay: function('APPROVED'|'REJECTED'): Promise<Object|null>,
 * }} Estado del pedido y acciones
 * @throws {None} Errores atrapados y expuestos en `error` (carga) o `actionError` (acciones)
 * @sideeffects Peticiones HTTP al Order, Payment y Catalog Service
 */
export function useOrder(id) {
  // El resultado guarda el id al que pertenece: mientras no coincida con el id actual, se está cargando.
  const [result, setResult] = useState({ id: null, order: null, error: null });
  const [actionError, setActionError] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    loadOrder(id)
      .then(order => {
        if (!cancelled) setResult({ id, order, error: null });
      })
      .catch(err => {
        if (!cancelled) setResult({ id, order: null, error: err.message });
      });

    return () => { cancelled = true; };
  }, [id]);

  /**
   * Ejecuta una acción sobre el pedido y lo recarga.
   *
   * @param {function(): Promise<unknown>} action - Llamada al servicio
   * @returns {Promise<unknown|null>} Resultado de la acción, o null si falló
   */
  const runAction = async (action) => {
    setPending(true);
    setActionError(null);
    try {
      const value = await action();
      setResult({ id, order: await loadOrder(id), error: null });
      return value;
    } catch (err) {
      setActionError(err.message);
      return null;
    } finally {
      setPending(false);
    }
  };

  const isCurrent = result.id === id;
  const order = isCurrent ? result.order : null;

  const cancel = () => runAction(() => cancelOrder(id));

  // El monto debe ser exactamente el total del pedido; el backend lo valida
  const pay = (simulateResult) =>
    runAction(() => processPayment({ orderId: id, amount: order.total, simulateResult }));

  return {
    order,
    loading: Boolean(id) && !isCurrent,
    error: isCurrent ? result.error : null,
    actionError,
    pending,
    cancel,
    pay,
  };
}
