import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PageMessage from '../components/PageMessage';
import { formatCurrency, formatDate, shortId } from '../utils/format';

/**
 * Componente OrdersPage — Historial de pedidos.
 * Propósito: Listar los pedidos del usuario (un ADMIN ve todos, según el backend) con su estado y total.
 *
 * @returns {JSX.Element} Historial según su estado (cargando, error, vacío o con pedidos)
 * @throws {None}
 * @sideeffects Usa `useOrders`, que llama al Order Service
 */
function OrdersPage() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return <PageMessage title="Cargando tus pedidos..." />;
  }

  if (error) {
    return <PageMessage icon="error" title="Ocurrió un error" text={error} link={{ to: '/', label: 'Volver al inicio' }} />;
  }

  if (orders.length === 0) {
    return (
      <PageMessage
        icon="receipt_long"
        title="Aún no tienes pedidos"
        text="Cuando confirmes una compra la verás aquí."
        link={{ to: '/', label: 'Ir de compras' }}
      />
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-page-title">Mis pedidos</h1>
        <p className="orders-page-subtitle">
          {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
        </p>
      </div>

      <ul className="orders-list">
        {orders.map(order => {
          const units = order.items.reduce((acc, item) => acc + item.quantity, 0);

          return (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="orders-list-item">
                <div className="orders-list-info">
                  <span className="orders-list-id">Pedido #{shortId(order.id)}</span>
                  <span className="orders-list-meta">
                    {formatDate(order.createdAt)} · {units} {units === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="orders-list-total">{formatCurrency(order.total)}</span>
                <span className="material-symbols-outlined orders-list-chevron">chevron_right</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default OrdersPage;
