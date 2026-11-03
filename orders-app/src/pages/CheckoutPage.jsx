import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import OrderItemsList from '../components/OrderItemsList';
import PageMessage from '../components/PageMessage';

/**
 * Componente CheckoutPage — Confirmación del pedido.
 * Propósito: Mostrar el resumen del carrito, pedir la dirección de envío y crear el pedido.
 * Al crearlo, el backend vacía el carrito y se pasa al pago simulado.
 *
 * @returns {JSX.Element} Formulario de checkout según el estado del carrito
 * @throws {None}
 * @sideeffects Usa `useCheckout` (Cart, Catalog y Order Service); navega a `/orders/:id/pay`
 */
function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, error, submitting, submitError, placeOrder } = useCheckout();
  const [address, setAddress] = useState('');

  if (loading) {
    return <PageMessage title="Preparando tu pedido..." />;
  }

  if (error) {
    return <PageMessage icon="error" title="Ocurrió un error" text={error} link={{ to: '/cart', label: 'Volver al carrito' }} />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <PageMessage
        icon="shopping_cart"
        title="Tu carrito está vacío"
        text="Agrega productos antes de confirmar un pedido."
        link={{ to: '/', label: 'Ir de compras' }}
      />
    );
  }

  /**
   * Crea el pedido y pasa al pago.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Envío del formulario
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const orderId = await placeOrder(address.trim());
    if (orderId) navigate(`/orders/${orderId}/pay`, { replace: true });
  };

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-page-title">Checkout</h1>
        <p className="orders-page-subtitle">Revisa tu pedido y dinos dónde enviarlo</p>
      </div>

      {submitError && (
        <div role="alert" className="orders-alert-error">
          {submitError}
        </div>
      )}

      <div className="checkout-layout">
        <form className="orders-card checkout-form" onSubmit={handleSubmit}>
          <h2 className="orders-card-title">Dirección de envío</h2>
          <label htmlFor="checkout-address" className="checkout-label">
            Dirección completa
          </label>
          <textarea
            id="checkout-address"
            className="checkout-textarea"
            rows={4}
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Calle, número, ciudad, código postal"
            disabled={submitting}
          />
          <button type="submit" className="orders-primary-btn" disabled={submitting || !address.trim()}>
            {submitting ? 'Creando pedido...' : 'Confirmar pedido'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button type="button" className="orders-back-link" onClick={() => navigate('/cart')} disabled={submitting}>
            <span className="material-symbols-outlined">arrow_back</span>
            Volver al carrito
          </button>
        </form>

        <section className="orders-card checkout-summary">
          <h2 className="orders-card-title">Resumen</h2>
          <OrderItemsList items={cart.items} total={cart.total} />
        </section>
      </div>
    </div>
  );
}

export default CheckoutPage;
