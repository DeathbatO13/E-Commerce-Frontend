import { useAdminResource } from './useAdminResource';
import { getProducts, getCategories } from '../services/catalogAdminService';
import { getAllOrders } from '../services/ordersAdminService';

/** Umbral de stock bajo para los productos activos. */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Calcula los indicadores del resumen.
 *
 * @returns {Promise<Object>} Indicadores
 * @throws {Error} Si algún servicio falla
 * @sideeffects Peticiones HTTP a Catalog y Order Service
 */
async function loadDashboard() {
  const [products, categories, orders] = await Promise.all([getProducts(), getCategories(), getAllOrders()]);
  const activeProducts = products.filter(product => product.active);
  const paidOrders = orders.filter(order => order.status === 'PAID');

  return {
    totalProducts: products.length,
    activeProducts: activeProducts.length,
    activeCategories: categories.filter(category => category.active).length,
    ordersByStatus: {
      CREATED: orders.filter(order => order.status === 'CREATED').length,
      PAID: paidOrders.length,
      CANCELLED: orders.filter(order => order.status === 'CANCELLED').length,
    },
    revenue: paidOrders.reduce((acc, order) => acc + order.total, 0),
    lowStock: activeProducts
      .filter(product => product.stock <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stock - b.stock),
  };
}

/**
 * Hook custom useDashboard.
 * Propósito: Indicadores del panel (catálogo, pedidos por estado, ingresos y stock bajo).
 *
 * @returns {{ stats: Object|null, loading: boolean, error: string|null }} Indicadores
 * @throws {None}
 * @sideeffects Peticiones HTTP a Catalog y Order Service
 */
export function useDashboard() {
  const { data, loading, error } = useAdminResource(loadDashboard);
  return { stats: data, loading, error };
}
