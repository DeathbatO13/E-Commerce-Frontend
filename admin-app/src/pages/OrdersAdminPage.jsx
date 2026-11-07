import { Fragment, useState } from 'react';
import { useOrdersAdmin } from '../hooks/useOrdersAdmin';
import PageMessage from '../components/PageMessage';
import Badge from '../components/Badge';
import { formatCurrency, formatDate, shortId, ORDER_STATUS_LABELS } from '../utils/format';

/** Color de la etiqueta por estado del pedido. */
const STATUS_VARIANTS = { CREATED: 'warning', PAID: 'success', CANCELLED: 'neutral' };

/**
 * Componente OrdersAdminPage — Pedidos de todos los usuarios.
 * Propósito: Ver los pedidos globales (regla 6.1), filtrarlos por estado, ver sus ítems y cancelar los que
 * siguen pendientes de pago (regla 4.3).
 *
 * @returns {JSX.Element} Tabla de pedidos
 * @throws {None}
 * @sideeffects Usa `useOrdersAdmin` (Order, Auth y Catalog Service)
 */
function OrdersAdminPage() {
  const { orders, emailByUser, nameByProduct, loading, error, actionError, pending, cancel } = useOrdersAdmin();
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  if (loading) return <PageMessage title="Cargando pedidos..." />;
  if (error) return <PageMessage icon="error" title="Ocurrió un error" text={error} />;

  const visible = status ? orders.filter(order => order.status === status) : orders;

  /**
   * Cancela un pedido tras confirmar.
   *
   * @param {Object} order - Pedido
   * @returns {void}
   */
  const handleCancel = (order) => {
    if (window.confirm(`¿Cancelar el pedido #${shortId(order.id)}?`)) cancel(order.id);
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Pedidos</h1>
      </header>

      {actionError && <div role="alert" className="admin-alert-error">{actionError}</div>}

      <div className="admin-toolbar">
        <select className="admin-input admin-select" aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <span className="admin-muted">{visible.length} de {orders.length}</span>
      </div>

      {visible.length === 0 ? (
        <PageMessage icon="receipt_long" title="No hay pedidos" />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th className="admin-cell-number">Total</th>
                <th>Estado</th>
                <th className="admin-cell-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(order => {
                const expanded = expandedId === order.id;

                return (
                  <Fragment key={order.id}>
                    <tr>
                      <td>
                        <button
                          className="admin-link-btn"
                          onClick={() => setExpandedId(expanded ? null : order.id)}
                          aria-expanded={expanded}
                        >
                          <span className="material-symbols-outlined">{expanded ? 'expand_less' : 'expand_more'}</span>
                          #{shortId(order.id)}
                        </button>
                      </td>
                      <td>{emailByUser.get(order.userId) ?? shortId(order.userId)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="admin-cell-number">{formatCurrency(order.total)}</td>
                      <td>
                        <Badge variant={STATUS_VARIANTS[order.status]}>{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                      </td>
                      <td className="admin-cell-actions">
                        {order.status === 'CREATED' && (
                          <button className="admin-link-btn admin-link-btn-danger" onClick={() => handleCancel(order)} disabled={pending}>
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="admin-row-detail">
                        <td colSpan={6}>
                          <ul className="admin-simple-list">
                            {order.items.map(item => (
                              <li key={item.productId} className="admin-simple-list-item">
                                <span>{nameByProduct.get(item.productId) ?? shortId(item.productId)} × {item.quantity}</span>
                                <span className="admin-simple-list-value">{formatCurrency(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersAdminPage;
