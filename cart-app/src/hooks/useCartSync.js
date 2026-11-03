import { useEffect, useState } from 'react';
import { AUTH_SESSION_EVENT, getSession } from 'authApp/authService';
import { addCartItem, getCart } from '../services/cartService';
import { CART_ADD_ITEM, emitCartUpdated } from '../services/cartEvents';

/**
 * Publica el total real del carrito (0 si no hay sesión).
 *
 * @returns {Promise<void>}
 * @throws {Error} Si el Cart Service falla
 * @sideeffects Petición HTTP GET a /cart; emite `CART_UPDATED`
 */
async function publishCartCount() {
  if (!getSession().isAuthenticated) {
    emitCartUpdated([]);
    return;
  }
  const cart = await getCart();
  emitCartUpdated(cart?.items ?? []);
}

/**
 * Hook custom useCartSync.
 * Propósito: Mantener el carrito sincronizado desde cualquier página del Shell:
 * - agrega al backend los productos pedidos con `CART_ADD_ITEM` (los emite Catalog App),
 * - publica el total real al montar y cada vez que cambia la sesión.
 *
 * @returns {{ error: string|null, dismissError: function(): void }} Último error y acción para descartarlo
 * @throws {None} Errores atrapados y expuestos en `error`
 * @sideeffects Escucha eventos de window; peticiones HTTP al Cart Service
 */
export function useCartSync() {
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    function sync() {
      publishCartCount().catch(err => {
        if (active) setError(err.message);
      });
    }

    async function handleAddItem(event) {
      if (!getSession().isAuthenticated) return;
      try {
        await addCartItem(event.detail);
        await publishCartCount();
        if (active) setError(null);
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    sync();
    window.addEventListener(AUTH_SESSION_EVENT, sync);
    window.addEventListener(CART_ADD_ITEM, handleAddItem);

    return () => {
      active = false;
      window.removeEventListener(AUTH_SESSION_EVENT, sync);
      window.removeEventListener(CART_ADD_ITEM, handleAddItem);
    };
  }, []);

  return { error, dismissError: () => setError(null) };
}
