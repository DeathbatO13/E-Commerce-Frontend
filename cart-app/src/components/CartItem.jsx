/**
 * Componente CartItem.
 * Propósito: Muestra un ítem individual del carrito.
 *
 * @param {Object} props
 * @param {Object} props.item
 * @param {function} props.onUpdateQuantity
 * @param {function} props.onRemove
 */
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price);
  const total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity);

  return (
    <div className="cart-item">
      <div className="cart-item-info-col">
        <div className="cart-item-image">
          {item.name === "Camiseta Gráfica" ? (
             <span className="material-symbols-outlined cart-item-placeholder-icon">apparel</span>
          ) : (
             <span className="material-symbols-outlined cart-item-placeholder-icon">sports_score</span>
          )}
        </div>
        <div className="cart-item-details">
          <p className="cart-item-title">{item.name}</p>
          <p className="cart-item-variant">{item.variant}</p>
        </div>
      </div>
      
      <div className="cart-item-quantity-col">
        <div className="cart-item-quantity-selector">
          <button 
            className="cart-item-quantity-btn" 
            onClick={() => onUpdateQuantity(item.productId, item.quantity, -1)}
            disabled={item.quantity <= 1}
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="cart-item-quantity-value">{item.quantity}</span>
          <button 
            className="cart-item-quantity-btn" 
            onClick={() => onUpdateQuantity(item.productId, item.quantity, 1)}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="cart-item-price-col">
        <p className="cart-item-price">{price}</p>
      </div>

      <div className="cart-item-total-col">
        <p className="cart-item-total">{total}</p>
      </div>
    </div>
  );
}

export default CartItem;
