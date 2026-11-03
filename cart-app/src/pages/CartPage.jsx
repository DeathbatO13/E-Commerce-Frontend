import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

/** Ruta de Orders App donde empieza el checkout. */
const CHECKOUT_PATH = '/orders/checkout';

/**
 * Componente CartPage — Página principal del carrito.
 * Propósito: Listar los ítems del carrito, permitir cambiar cantidades, eliminar ítems o vaciarlo,
 * y pasar al checkout. La protección por sesión la hace el Shell (`ProtectedRoute`).
 *
 * @returns {JSX.Element} Vista del carrito según su estado (cargando, error, vacío o con ítems)
 * @throws {None}
 * @sideeffects Usa `useCart`, que llama al Cart Service; navega con react-router
 */
function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, error, actionError, pending, updateQuantity, removeItem, emptyCart } = useCart();

  if (loading) {
    return (
      <div className="cart-page-loading">
        <p>Cargando tu carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page-error">
        <h2>Ocurrió un error</h2>
        <p>{error}</p>
        <button className="cart-page-back-link" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al inicio
        </button>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <span className="material-symbols-outlined cart-page-empty-icon">shopping_cart</span>
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega algunos productos para comenzar!</p>
        <button className="cart-page-back-link" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Ir de compras
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1 className="cart-page-title">Tu Carrito de Compras</h1>
        <p className="cart-page-subtitle">
          Tienes {totalItems} {totalItems === 1 ? 'item' : 'items'} en tu carrito
        </p>
      </div>

      {actionError && (
        <div role="alert" className="cart-page-alert">
          {actionError}
        </div>
      )}

      <div className="cart-page-content">
        <div className={`cart-page-items-container ${pending ? 'cart-page-items-pending' : ''}`}>
          <div className="cart-items-header">
            <span className="cart-items-header-product">Producto</span>
            <span className="cart-items-header-quantity">Cantidad</span>
            <span className="cart-items-header-price">Precio</span>
            <span className="cart-items-header-total">Total</span>
          </div>

          <div className="cart-items-list">
            {items.map(item => (
              <CartItem
                key={item.productId}
                item={item}
                disabled={pending}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="cart-page-actions">
            <button className="cart-page-back-link" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined">arrow_back</span>
              Continuar Comprando
            </button>
            <button className="cart-page-clear-btn" onClick={emptyCart} disabled={pending}>
              <span className="material-symbols-outlined">remove_shopping_cart</span>
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="cart-page-summary-container">
          <OrderSummary
            subtotal={cart.total}
            disabled={pending}
            onCheckout={() => navigate(CHECKOUT_PATH)}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
