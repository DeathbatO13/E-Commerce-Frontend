import { Link, useLocation, useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderItemsList from '../components/OrderItemsList';
import PageMessage from '../components/PageMessage';
import { formatDate, shortId } from '../utils/format';

/**
 * Componente OrderDetailPage — Detalle de un pedido.
 * Propósito: Mostrar ítems, estado y total. Si el pedido está pendiente (`CREATED`) permite pagarlo
 * o cancelarlo (regla 4.3: un pedido pagado no se cancela).
 *
 * @returns {JSX.Element} Detalle del pedido según su estado
 * @throws {None}
 * @sideeffects Usa `useOrder` (Order y Catalog Service); pide confirmación antes de cancelar
 */
function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { order, loading, error, actionError, pending, cancel } = useOrder(id);

  if (loading) {
    return <PageMessage title="Cargando el pedido..." />;
  }

  if (error) {
    return <PageMessage icon="error" title="Ocurrió un error" text={error} link={{ to: '/orders', label: 'Ver mis pedidos' }} />;
  }

  /**
   * Cancela el pedido tras confirmar con el usuario.
   *
   * @returns {void}
   */
  const handleCancel = () => {
    if (window.confirm('¿Seguro que quieres cancelar este pedido?')) cancel();
  };

  const isPending = order.status === 'CREATED';

  return (
    <div className="orders-page orders-page-narrow">
      <div className="orders-page-header">
        <div>
          <h1 className="orders-page-title">Pedido #{shortId(order.id)}</h1>
          <p className="orders-page-subtitle">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {location.state?.paid && order.status === 'PAID' && (
        <div role="status" className="orders-alert-success">
          ¡Pago aprobado! Tu pedido quedó confirmado.
        </div>
      )}
      {actionError && (
        <div role="alert" className="orders-alert-error">
          {actionError}
        </div>
      )}

      <section className="orders-card">
        <h2 className="orders-card-title">Productos</h2>
        <OrderItemsList items={order.items} total={order.total} />
      </section>

      <div className="order-detail-actions">
        <Link to="/orders" className="orders-back-link">
          <span className="material-symbols-outlined">arrow_back</span>
          Mis pedidos
        </Link>

        {isPending && (
          <div className="order-detail-buttons">
            <button className="orders-danger-btn" onClick={handleCancel} disabled={pending}>
              Cancelar pedido
            </button>
            <Link to={`/orders/${order.id}/pay`} className="orders-primary-btn">
              <span className="material-symbols-outlined">credit_card</span>
              Pagar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetailPage;
