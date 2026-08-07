import { useEffect, useState } from 'react'
import { on, CART_ADD_ITEM } from './eventBus'

const CART_COUNT_KEY = 'ecommerce.cartCount'

/**
 * Hook custom useCartBadge.
 * Propósito: Mantener un contador reactivo de ítems agregados al carrito,
 * persistiéndolo en localStorage para que sobreviva recargas de página.
 * Escucha el evento `CART_ADD_ITEM` del bus de eventos para incrementarse
 * cada vez que un producto se agrega desde cualquier microfrontend.
 *
 * @returns {{ count: number, reset: function }} Contador actual y función para resetearlo
 * @sideeffects Lee y escribe en localStorage. Suscribe y desuscribe del eventBus.
 */
export function useCartBadge() {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem(CART_COUNT_KEY)
    return stored ? parseInt(stored, 10) : 0
  })

  useEffect(() => {
    /**
     * Handler para el evento de agregar al carrito.
     *
     * @param {CustomEvent} event - Evento con payload `{ productId, quantity }`
     * @returns {void}
     */
    function handleCartAdd(event) {
      const quantity = event.detail?.quantity ?? 1
      setCount(previous => {
        const next = previous + quantity
        localStorage.setItem(CART_COUNT_KEY, String(next))
        return next
      })
    }

    const cleanup = on(CART_ADD_ITEM, handleCartAdd)
    return cleanup
  }, [])

  /**
   * Resetea el contador del carrito a cero.
   * Llamar al vaciar el carrito o al finalizar una compra.
   *
   * @returns {void}
   * @sideeffects Escribe en localStorage
   */
  function reset() {
    setCount(0)
    localStorage.removeItem(CART_COUNT_KEY)
  }

  return { count, reset }
}
