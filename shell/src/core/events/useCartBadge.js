import { useEffect, useState } from 'react'
import { on, CART_UPDATED } from './eventBus'

const CART_COUNT_KEY = 'ecommerce.cartCount'

/**
 * Hook custom useCartBadge.
 * Propósito: Mostrar en el navbar la cantidad real de unidades del carrito.
 * Escucha `CART_UPDATED`, que Cart App emite con el total del backend cada vez que lo conoce.
 * El último valor se guarda en localStorage solo para pintar algo en la primera carga,
 * antes de que Cart App confirme el total.
 *
 * @returns {{ count: number }} Unidades en el carrito
 * @sideeffects Lee y escribe en localStorage. Suscribe y desuscribe del eventBus.
 */
export function useCartBadge() {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem(CART_COUNT_KEY)
    return stored ? parseInt(stored, 10) : 0
  })

  useEffect(() => {
    /**
     * Handler para el evento de carrito actualizado.
     *
     * @param {CustomEvent} event - Evento con payload `{ itemCount }`
     * @returns {void}
     */
    function handleCartUpdated(event) {
      const next = event.detail?.itemCount ?? 0
      localStorage.setItem(CART_COUNT_KEY, String(next))
      setCount(next)
    }

    return on(CART_UPDATED, handleCartUpdated)
  }, [])

  return { count }
}
