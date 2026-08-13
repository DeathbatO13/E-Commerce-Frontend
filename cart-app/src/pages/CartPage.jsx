import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

// Se asume que authApp expondrá algo similar para verificar sesión.
// Por ahora simularemos la redirección si fuera necesario, o 
// idealmente lo importamos de authApp/authService.
import { getSession } from 'authApp/authService';

/**
 * Página principal del carrito.
 */
function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, error, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    // Protección de ruta
    const session = getSession();
    if (!session.isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

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

      <div className="cart-page-content">
        <div className="cart-page-items-container">
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
          </div>
        </div>

        <div className="cart-page-summary-container">
          <OrderSummary subtotal={cart.total} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
