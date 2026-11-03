/**
 * Componente CartItem.
 * Propósito: Muestra un ítem individual del carrito con sus controles de cantidad y eliminación.
 *
 * @param {Object} props
 * @param {{ productId: string, quantity: number, price: number, name: string|null, categoryName: string|null }} props.item - Ítem enriquecido
 * @param {function(string, number, number): void} props.onUpdateQuantity - Recibe productId, cantidad actual y delta (+1/-1)
 * @param {function(string): void} props.onRemove - Recibe el productId a eliminar
 * @param {boolean} [props.disabled=false] - Deshabilita los controles mientras hay una acción en curso
 * @returns {JSX.Element} Fila del carrito
 */
function CartItem({ item, onUpdateQuantity, onRemove, disabled = false }) {
  const name = item.name || 'Producto no disponible';
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price);
  const total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity);

  return (
    <div className="cart-item">
      <div className="cart-item-info-col">
        <div className="cart-item-image">
          <span className="material-symbols-outlined cart-item-placeholder-icon">inventory_2</span>
        </div>
        <div className="cart-item-details">
          <p className="cart-item-title">{name}</p>
          {item.categoryName && <p className="cart-item-variant">{item.categoryName}</p>}
          <button
            type="button"
            className="cart-item-remove-btn"
            onClick={() => onRemove(item.productId)}
            disabled={disabled}
            aria-label={`Eliminar ${name} del carrito`}
          >
            <span className="material-symbols-outlined">delete</span>
            Eliminar
          </button>
        </div>
      </div>
      
      <div className="cart-item-quantity-col">
        <div className="cart-item-quantity-selector">
          <button 
            className="cart-item-quantity-btn" 
            onClick={() => onUpdateQuantity(item.productId, item.quantity, -1)}
            disabled={disabled || item.quantity <= 1}
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="cart-item-quantity-value">{item.quantity}</span>
          <button 
            className="cart-item-quantity-btn" 
            onClick={() => onUpdateQuantity(item.productId, item.quantity, 1)}
            disabled={disabled}
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
