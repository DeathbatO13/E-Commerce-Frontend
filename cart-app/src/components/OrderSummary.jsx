/**
 * Componente OrderSummary.
 * Propósito: Muestra el resumen del pedido (subtotal, envío, total).
 *
 * @param {Object} props
 * @param {number} props.subtotal
 */
function OrderSummary({ subtotal }) {
  const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
  // Asumiendo envío gratis o calculado después para igualar el mockup
  const total = subtotal; 
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

  return (
    <div className="order-summary-card">
      <h2 className="order-summary-title">Resumen del Pedido</h2>
      
      <div className="order-summary-row">
        <span className="order-summary-label">Subtotal</span>
        <span className="order-summary-value">{formattedSubtotal}</span>
      </div>
      
      <div className="order-summary-row order-summary-shipping">
        <span className="order-summary-label">Envío</span>
        <span className="order-summary-value-light">Calculado en el siguiente paso</span>
      </div>
      
      <div className="order-summary-divider"></div>
      
      <div className="order-summary-row order-summary-total-row">
        <span className="order-summary-total-label">Total</span>
        <span className="order-summary-total-value">{formattedTotal}</span>
      </div>
      
      <button className="order-summary-checkout-btn">
        Proceder al Checkout
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  );
}

export default OrderSummary;
