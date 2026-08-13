import { useState, useEffect, useCallback } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../services/cartService';

/**
 * Hook para manejar el estado del carrito.
 */
export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) return;

    try {
      await updateCartItem(productId, newQuantity);
      // Actualización optimista
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.map(item => 
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return { ...prev, items: newItems, total: newTotal };
      });
    } catch (err) {
      console.error('Error al actualizar cantidad', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeCartItem(productId);
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.filter(item => item.productId !== productId);
        const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return { ...prev, items: newItems, total: newTotal };
      });
    } catch (err) {
      console.error('Error al eliminar ítem', err);
    }
  };

  return {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    refetch: fetchCart
  };
}
