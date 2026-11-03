import { useCartSync } from '../hooks/useCartSync';

/**
 * Componente CartSync.
 * Propósito: Sincronizar el carrito con el backend desde cualquier página. El Shell lo monta una sola
 * vez en su layout; no tiene UI salvo un aviso cuando falla agregar un producto.
 * Expuesto vía Module Federation como: cartApp/CartSync
 *
 * @returns {JSX.Element|null} Aviso de error o nada
 * @throws {None}
 * @sideeffects Escucha `CART_ADD_ITEM` y cambios de sesión; llama al Cart Service
 */
function CartSync() {
  const { error, dismissError } = useCartSync();

  if (!error) return null;

  return (
    <div role="alert" className="cart-sync-toast">
      <span className="material-symbols-outlined cart-sync-toast-icon">error</span>
      <p className="cart-sync-toast-text">{error}</p>
      <button type="button" className="cart-sync-toast-close" onClick={dismissError} aria-label="Cerrar aviso">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}

export default CartSync;
