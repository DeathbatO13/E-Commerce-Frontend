import { Link } from 'react-router-dom';
import { useDashboard, LOW_STOCK_THRESHOLD } from '../hooks/useDashboard';
import PageMessage from '../components/PageMessage';
import { formatCurrency, ORDER_STATUS_LABELS } from '../utils/format';

/**
 * Componente DashboardPage — Resumen del panel.
 * Propósito: Indicadores rápidos del catálogo y los pedidos, con accesos a cada sección.
 *
 * @returns {JSX.Element} Tarjetas de indicadores y lista de stock bajo
 * @throws {None}
 * @sideeffects Usa `useDashboard` (Catalog y Order Service)
 */
function DashboardPage() {
  const { stats, loading, error } = useDashboard();

  if (loading) return <PageMessage title="Cargando el resumen..." />;
  if (error) return <PageMessage icon="error" title="Ocurrió un error" text={error} />;

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Resumen</h1>
      </header>

      <div className="admin-stats">
        <Link to="/admin/products" className="admin-stat">
          <span className="admin-stat-label">Productos activos</span>
          <span className="admin-stat-value">{stats.activeProducts}</span>
          <span className="admin-stat-hint">de {stats.totalProducts} en total</span>
        </Link>
        <Link to="/admin/categories" className="admin-stat">
          <span className="admin-stat-label">Categorías activas</span>
          <span className="admin-stat-value">{stats.activeCategories}</span>
        </Link>
        <Link to="/admin/orders" className="admin-stat">
          <span className="admin-stat-label">{ORDER_STATUS_LABELS.CREATED}</span>
          <span className="admin-stat-value">{stats.ordersByStatus.CREATED}</span>
          <span className="admin-stat-hint">
            {stats.ordersByStatus.PAID} pagados · {stats.ordersByStatus.CANCELLED} cancelados
          </span>
        </Link>
        <div className="admin-stat">
          <span className="admin-stat-label">Ingresos (pedidos pagados)</span>
          <span className="admin-stat-value">{formatCurrency(stats.revenue)}</span>
        </div>
      </div>

      <section className="admin-card">
        <h2 className="admin-card-title">Stock bajo (≤ {LOW_STOCK_THRESHOLD} unidades)</h2>
        {stats.lowStock.length === 0 ? (
          <p className="admin-muted">Ningún producto activo tiene stock bajo.</p>
        ) : (
          <ul className="admin-simple-list">
            {stats.lowStock.map(product => (
              <li key={product.id} className="admin-simple-list-item">
                <span>{product.name}</span>
                <span className="admin-simple-list-value">{product.stock} u.</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
