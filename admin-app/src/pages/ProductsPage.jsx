import { useState } from 'react';
import { useCatalogAdmin } from '../hooks/useCatalogAdmin';
import ProductForm from '../components/ProductForm';
import PageMessage from '../components/PageMessage';
import Badge from '../components/Badge';
import { formatCurrency } from '../utils/format';

/** Valor de `editing` cuando el formulario crea un producto nuevo. */
const NEW_PRODUCT = 'new';

/**
 * Componente ProductsPage — CRUD de productos.
 * Propósito: Listar todos los productos (activos e inactivos), crear, editar, desactivar y reactivar.
 * Eliminar desactiva el producto: deja de venderse pero sigue en el historial (regla 3.2).
 *
 * @returns {JSX.Element} Tabla de productos con formulario de alta/edición
 * @throws {None}
 * @sideeffects Usa `useCatalogAdmin` (Catalog Service)
 */
function ProductsPage() {
  const {
    products, categories, loading, error, actionError, pending, clearActionError, saveProduct, setProductActive,
  } = useCatalogAdmin();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  if (loading) return <PageMessage title="Cargando productos..." />;
  if (error) return <PageMessage icon="error" title="Ocurrió un error" text={error} />;

  const categoryName = new Map(categories.map(category => [category.id, category.name]));
  const term = search.trim().toLowerCase();
  const visible = products
    .filter(product => !term || product.name.toLowerCase().includes(term))
    .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));

  /**
   * Abre el formulario.
   *
   * @param {Object|typeof NEW_PRODUCT} target - Producto a editar o `NEW_PRODUCT`
   * @returns {void}
   */
  const openForm = (target) => {
    clearActionError();
    setEditing(target);
  };

  /**
   * Guarda el formulario y lo cierra si el backend aceptó los datos.
   *
   * @param {Object} values - Datos validados
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values) => {
    const id = editing === NEW_PRODUCT ? null : editing.id;
    if (await saveProduct(id, values)) setEditing(null);
  };

  /**
   * Desactiva un producto tras confirmar.
   *
   * @param {Object} product - Producto
   * @returns {void}
   */
  const handleDeactivate = (product) => {
    if (window.confirm(`¿Desactivar "${product.name}"? Dejará de mostrarse a la venta.`)) {
      setProductActive(product, false);
    }
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Productos</h1>
        <button className="admin-primary-btn" onClick={() => openForm(NEW_PRODUCT)} disabled={pending || editing !== null}>
          <span className="material-symbols-outlined">add</span>
          Nuevo producto
        </button>
      </header>

      {actionError && <div role="alert" className="admin-alert-error">{actionError}</div>}

      {editing !== null && (
        <ProductForm
          key={editing === NEW_PRODUCT ? NEW_PRODUCT : editing.id}
          product={editing === NEW_PRODUCT ? null : editing}
          categories={categories}
          pending={pending}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input admin-search"
          placeholder="Buscar por nombre"
          aria-label="Buscar productos por nombre"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span className="admin-muted">{visible.length} de {products.length}</span>
      </div>

      {visible.length === 0 ? (
        <PageMessage icon="inventory_2" title="No hay productos" text={term ? 'Ninguno coincide con la búsqueda.' : 'Crea el primero.'} />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="admin-cell-number">Precio</th>
                <th className="admin-cell-number">Stock</th>
                <th>Estado</th>
                <th className="admin-cell-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(product => (
                <tr key={product.id} className={product.active ? '' : 'admin-row-muted'}>
                  <td>
                    <span className="admin-cell-title">{product.name}</span>
                    <span className="admin-cell-subtitle">{product.description}</span>
                  </td>
                  <td>{categoryName.get(product.categoryId) ?? '—'}</td>
                  <td className="admin-cell-number">{formatCurrency(product.price)}</td>
                  <td className="admin-cell-number">{product.stock}</td>
                  <td>
                    <Badge variant={product.active ? 'success' : 'neutral'}>{product.active ? 'Activo' : 'Inactivo'}</Badge>
                  </td>
                  <td className="admin-cell-actions">
                    <button className="admin-link-btn" onClick={() => openForm(product)} disabled={pending}>
                      Editar
                    </button>
                    {product.active ? (
                      <button className="admin-link-btn admin-link-btn-danger" onClick={() => handleDeactivate(product)} disabled={pending}>
                        Desactivar
                      </button>
                    ) : (
                      <button className="admin-link-btn" onClick={() => setProductActive(product, true)} disabled={pending}>
                        Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
