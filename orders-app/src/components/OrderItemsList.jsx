import { formatCurrency } from '../utils/format';

/**
 * Componente OrderItemsList.
 * Propósito: Listar los ítems de un carrito o pedido con su subtotal y el total.
 *
 * @param {Object} props
 * @param {Array<{ productId: string, name: string|null, quantity: number, price: number }>} props.items - Ítems
 * @param {number} props.total - Total según el backend
 * @returns {JSX.Element} Lista de ítems con total
 */
function OrderItemsList({ items, total }) {
  return (
    <div className="order-items">
      <ul className="order-items-list">
        {items.map(item => (
          <li key={item.productId} className="order-item">
            <div className="order-item-info">
              <span className="order-item-name">{item.name ?? 'Producto no disponible'}</span>
              <span className="order-item-meta">
                {item.quantity} × {formatCurrency(item.price)}
              </span>
            </div>
            <span className="order-item-subtotal">{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="order-items-total">
        <span>Total</span>
        <span className="order-items-total-value">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default OrderItemsList;
