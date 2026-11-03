import { useState, useEffect, useCallback } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { enrichCartItems } from '../services/productService';
import { emitCartUpdated } from '../services/cartEvents';

/**
 * Carga el carrito del backend, lo enriquece con datos del catálogo y notifica el nuevo total al Shell.
 *
 * @returns {Promise<{ userId: string, items: Array<Object>, total: number }>} Carrito listo para la UI
 * @throws {Error} Si el Cart Service falla
 * @sideeffects Peticiones HTTP al Cart y Catalog Service; emite `CART_UPDATED`
 */
async function loadCart() {
  const data = await getCart();
  const items = await enrichCartItems(data?.items ?? []);
  emitCartUpdated(items);
  return { ...data, items, total: data?.total ?? 0 };
}

/**
 * Hook custom useCart.
 * Propósito: Gestionar el carrito del usuario contra el Cart Service. Tras cada acción se vuelve a
 * pedir el carrito, porque la API no documenta el cuerpo de las respuestas de escritura.
 *
 * @returns {{
 *   cart: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   updateQuantity: function(string, number, number): Promise<void>,
 *   removeItem: function(string): Promise<void>,
 *   emptyCart: function(): Promise<void>,
 * }} Estado del carrito y acciones
 * @throws {None} Errores atrapados y expuestos en `error` (carga) o `actionError` (acciones)
 * @sideeffects Peticiones HTTP al backend; emite `CART_UPDATED` tras cada cambio
 */
export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [pending, setPending] = useState(false);

  // Carga inicial: `loading` ya arranca en true, así que el efecto solo actualiza estado al resolver la promesa.
  useEffect(() => {
    let cancelled = false;

    loadCart()
      .then(data => {
        if (!cancelled) setCart(data);
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
   * Ejecuta una acción de escritura y recarga el carrito.
   *
   * @param {function(): Promise<void>} action - Llamada al servicio
   * @returns {Promise<void>}
   */
  const runAction = useCallback(async (action) => {
    setPending(true);
    setActionError(null);
    try {
      await action();
      setCart(await loadCart());
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(false);
    }
  }, []);

  const updateQuantity = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return Promise.resolve();
    return runAction(() => updateCartItem(productId, newQuantity));
  };

  const removeItem = (productId) => runAction(() => removeCartItem(productId));

  const emptyCart = () => runAction(() => clearCart());

  return {
    cart,
    loading,
    error,
    actionError,
    pending,
    updateQuantity,
    removeItem,
    emptyCart,
  };
}
