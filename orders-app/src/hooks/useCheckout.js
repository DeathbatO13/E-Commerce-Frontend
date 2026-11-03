import { useState, useEffect } from 'react';
import { getCart, emitCartCleared } from '../services/cartService';
import { enrichItems } from '../services/productService';
import { createOrder } from '../services/ordersService';

/**
 * Hook custom useCheckout.
 * Propósito: Cargar el carrito como resumen del checkout y crear el pedido con la dirección de envío.
 *
 * @returns {{
 *   cart: { items: Array<Object>, total: number }|null,
 *   loading: boolean,
 *   error: string|null,
 *   submitting: boolean,
 *   submitError: string|null,
 *   placeOrder: function(string): Promise<string|null>,
 * }} Estado del checkout y acción para confirmar el pedido
 * @throws {None} Errores atrapados y expuestos en `error` (carga) o `submitError` (creación)
 * @sideeffects Peticiones HTTP al Cart, Catalog y Order Service; emite `CART_UPDATED` al crear el pedido
 */
export function useCheckout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCart()
      .then(async data => {
        const items = await enrichItems(data?.items ?? []);
        if (!cancelled) setCart({ items, total: data?.total ?? 0 });
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar el carrito');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  /**
   * Crea el pedido. El backend vacía el carrito, así que se avisa al Shell para el badge.
   *
   * @param {string} address - Dirección de envío
   * @returns {Promise<string|null>} ID del pedido creado, o null si falló
   */
  const placeOrder = async (address) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const orderId = await createOrder(address);
      emitCartCleared();
      return orderId;
    } catch (err) {
      setSubmitError(err.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { cart, loading, error, submitting, submitError, placeOrder };
}
