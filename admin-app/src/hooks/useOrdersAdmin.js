import { useAdminResource } from './useAdminResource';
import { getAllOrders, cancelOrder } from '../services/ordersAdminService';
import { getUsers } from '../services/usersService';
import { getProducts } from '../services/catalogAdminService';

/**
 * Carga los pedidos y, como apoyo, usuarios y productos para mostrar email y nombres en lugar de UUID.
 * Si usuarios o productos fallan, los pedidos se muestran igual con los identificadores.
 *
 * @returns {Promise<{ orders: Array<Object>, emailByUser: Map<string, string>, nameByProduct: Map<string, string> }>} Datos de la sección
 * @throws {Error} Si el Order Service falla
 * @sideeffects Peticiones HTTP a Order, Auth y Catalog Service
 */
async function loadOrders() {
  const [orders, users, products] = await Promise.all([
    getAllOrders(),
    getUsers().catch(() => []),
    getProducts().catch(() => []),
  ]);

  return {
    orders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    emailByUser: new Map(users.map(user => [user.id, user.email])),
    nameByProduct: new Map(products.map(product => [product.id, product.name])),
  };
}

/**
 * Hook custom useOrdersAdmin.
 * Propósito: Pedidos de todos los usuarios (regla 6.1), del más reciente al más antiguo, y cancelación.
 *
 * @returns {{
 *   orders: Array<Object>,
 *   emailByUser: Map<string, string>,
 *   nameByProduct: Map<string, string>,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   cancel: function(string): Promise<boolean>,
 * }} Estado y acción de cancelar
 * @throws {None}
 * @sideeffects Peticiones HTTP a Order, Auth y Catalog Service
 */
export function useOrdersAdmin() {
  const { data, loading, error, actionError, pending, run } = useAdminResource(loadOrders);

  return {
    orders: data?.orders ?? [],
    emailByUser: data?.emailByUser ?? new Map(),
    nameByProduct: data?.nameByProduct ?? new Map(),
    loading,
    error,
    actionError,
    pending,
    cancel: (id) => run(() => cancelOrder(id)),
  };
}
