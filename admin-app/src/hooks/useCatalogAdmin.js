import { useAdminResource } from './useAdminResource';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/catalogAdminService';

/**
 * Carga productos y categorías juntos: las dos secciones necesitan ambos (nombre de categoría en la tabla de
 * productos, cantidad de productos por categoría para saber si se puede eliminar).
 *
 * @returns {Promise<{ products: Array<Object>, categories: Array<Object> }>} Catálogo completo
 * @throws {Error} Si el Catalog Service falla
 * @sideeffects Peticiones HTTP GET a /products y /categories
 */
async function loadCatalog() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return { products, categories };
}

/**
 * Hook custom useCatalogAdmin.
 * Propósito: Estado del catálogo para el panel y acciones de CRUD. Cada acción resuelve true si salió bien.
 *
 * @returns {{
 *   products: Array<Object>,
 *   categories: Array<Object>,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   clearActionError: function(): void,
 *   saveProduct: function(string|null, Object): Promise<boolean>,
 *   setProductActive: function(Object, boolean): Promise<boolean>,
 *   saveCategory: function(string|null, string): Promise<boolean>,
 *   removeCategory: function(string): Promise<boolean>,
 * }} Estado y acciones
 * @throws {None}
 * @sideeffects Peticiones HTTP al Catalog Service
 */
export function useCatalogAdmin() {
  const { data, loading, error, actionError, pending, run, clearActionError } = useAdminResource(loadCatalog);

  const products = data?.products ?? [];

  /**
   * Crea un producto o actualiza uno existente (conservando su estado `active`).
   *
   * @param {string|null} id - UUID del producto, o null para crear
   * @param {Object} values - Datos validados del formulario
   * @returns {Promise<boolean>} True si se guardó
   */
  const saveProduct = (id, values) => {
    if (!id) return run(() => createProduct(values));
    const current = products.find(product => product.id === id);
    return run(() => updateProduct(id, { ...values, active: current?.active ?? true }));
  };

  /**
   * Desactiva (DELETE) o reactiva (PUT con `active: true`) un producto.
   *
   * @param {Object} product - Producto
   * @param {boolean} active - Estado deseado
   * @returns {Promise<boolean>} True si se aplicó
   */
  const setProductActive = (product, active) =>
    run(() => (active ? updateProduct(product.id, { ...product, active: true }) : deleteProduct(product.id)));

  const saveCategory = (id, name) => run(() => (id ? updateCategory(id, name) : createCategory(name)));

  const removeCategory = (id) => run(() => deleteCategory(id));

  return {
    products,
    categories: data?.categories ?? [],
    loading,
    error,
    actionError,
    pending,
    clearActionError,
    saveProduct,
    setProductActive,
    saveCategory,
    removeCategory,
  };
}
