import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PageMessage from '../components/PageMessage';
import { formatCurrency, shortId } from '../utils/format';

/**
 * Componente PaymentPage — Pago simulado de un pedido.
 * Propósito: Pagar un pedido `CREATED` forzando el resultado del mock (`APPROVED` o `REJECTED`).
 * Si se aprueba, el pedido pasa a `PAID` y se muestra su detalle; si se rechaza, sigue pendiente
 * y se puede reintentar.
 *
 * @returns {JSX.Element} Pantalla de pago según el estado del pedido
 * @throws {None}
 * @sideeffects Usa `useOrder` (Order, Payment y Catalog Service); navega al detalle tras aprobar
 */
function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, error, actionError, pending, pay } = useOrder(id);
  const [rejected, setRejected] = useState(false);

  if (loading) {
    return <PageMessage title="Cargando el pedido..." />;
  }

  if (error) {
    return <PageMessage icon="error" title="Ocurrió un error" text={error} link={{ to: '/orders', label: 'Ver mis pedidos' }} />;
  }

  if (order.status !== 'CREATED') {
    return (
      <PageMessage
        icon="info"
        title="Este pedido no admite pagos"
        text={order.status === 'PAID' ? 'El pedido ya está pagado.' : 'El pedido fue cancelado.'}
        link={{ to: `/orders/${order.id}`, label: 'Ver el pedido' }}
      />
    );
  }

  /**
   * Procesa el pago con el resultado indicado.
   *
   * @param {'APPROVED'|'REJECTED'} simulateResult - Resultado forzado del mock
   * @returns {Promise<void>}
   */
  const handlePay = async (simulateResult) => {
    setRejected(false);
    const payment = await pay(simulateResult);
    if (payment?.status === 'APPROVED') {
      navigate(`/orders/${order.id}`, { replace: true, state: { paid: true } });
    } else if (payment?.status === 'REJECTED') {
      setRejected(true);
    }
  };

  return (
    <div className="orders-page orders-page-narrow">
      <div className="orders-page-header">
        <h1 className="orders-page-title">Pago</h1>
        <p className="orders-page-subtitle">Pedido #{shortId(order.id)}</p>
      </div>

      {rejected && (
        <div role="alert" className="orders-alert-error">
          El pago fue rechazado. Tu pedido sigue pendiente; puedes intentarlo de nuevo.
        </div>
      )}
      {actionError && (
        <div role="alert" className="orders-alert-error">
          {actionError}
        </div>
      )}

      <section className="orders-card payment-card">
        <div className="payment-row">
          <span className="payment-label">Estado</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="payment-row">
          <span className="payment-label">Total a pagar</span>
          <span className="payment-amount">{formatCurrency(order.total)}</span>
        </div>

        <p className="payment-note">
          Pasarela simulada: elige el resultado que quieres que devuelva el Payment Service.
        </p>

        <div className="payment-actions">
          <button className="orders-primary-btn" onClick={() => handlePay('APPROVED')} disabled={pending}>
            <span className="material-symbols-outlined">credit_card</span>
            {pending ? 'Procesando...' : `Pagar ${formatCurrency(order.total)}`}
          </button>
          <button className="orders-secondary-btn" onClick={() => handlePay('REJECTED')} disabled={pending}>
            Simular pago rechazado
          </button>
        </div>
      </section>

      <Link to={`/orders/${order.id}`} className="orders-back-link">
        <span className="material-symbols-outlined">arrow_back</span>
        Pagar más tarde
      </Link>
    </div>
  );
}

export default PaymentPage;
