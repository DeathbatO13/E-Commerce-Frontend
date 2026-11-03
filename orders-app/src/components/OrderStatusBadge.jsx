import { ORDER_STATUS_LABELS } from '../utils/format';

/**
 * Componente OrderStatusBadge.
 * Propósito: Mostrar el estado del pedido con un color por estado.
 *
 * @param {Object} props
 * @param {'CREATED'|'PAID'|'CANCELLED'} props.status - Estado del pedido
 * @returns {JSX.Element} Etiqueta de estado
 */
function OrderStatusBadge({ status }) {
  const variant = String(status).toLowerCase();

  return (
    <span className={`order-status-badge order-status-${variant}`}>
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default OrderStatusBadge;
