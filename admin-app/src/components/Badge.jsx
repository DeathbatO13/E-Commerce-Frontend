/**
 * Componente Badge.
 * Propósito: Etiqueta de estado con color por variante (estados de pedido, activo/inactivo, roles).
 *
 * @param {Object} props
 * @param {'success'|'warning'|'neutral'|'info'|'danger'} [props.variant='neutral'] - Color
 * @param {React.ReactNode} props.children - Texto
 * @returns {JSX.Element} Etiqueta
 */
function Badge({ variant = 'neutral', children }) {
  return <span className={`admin-badge admin-badge-${variant}`}>{children}</span>;
}

export default Badge;
