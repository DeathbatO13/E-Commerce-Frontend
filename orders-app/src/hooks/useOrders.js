import { useState, useEffect } from 'react';
import { getOrders } from '../services/ordersService';

/**
 * Hook custom useOrders.
 * Propósito: Cargar el historial de pedidos del usuario, del más reciente al más antiguo.
 *
 * @returns {{ orders: Array<Object>, loading: boolean, error: string|null }} Estado del historial
 * @throws {None} Errores atrapados y expuestos en `error`
 * @sideeffects Realiza una petición HTTP GET a /orders
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getOrders()
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (!cancelled) setOrders(sorted);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar los pedidos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { orders, loading, error };
}
