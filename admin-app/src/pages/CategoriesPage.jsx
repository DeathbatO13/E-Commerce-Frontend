import { useState } from 'react';
import { useCatalogAdmin } from '../hooks/useCatalogAdmin';
import PageMessage from '../components/PageMessage';
import Badge from '../components/Badge';
import { validateCategoryName } from '../utils/validation';

/**
 * Componente CategoriesPage — CRUD de categorías.
 * Propósito: Crear, renombrar y eliminar categorías. El backend no deja eliminar una categoría con productos
 * activos (responde 409), así que el botón se deshabilita en ese caso. Eliminar la desactiva; la API no
 * ofrece forma de reactivarla.
 *
 * @returns {JSX.Element} Formulario de alta y tabla de categorías
 * @throws {None}
 * @sideeffects Usa `useCatalogAdmin` (Catalog Service)
 */
function CategoriesPage() {
  const { products, categories, loading, error, actionError, pending, clearActionError, saveCategory, removeCategory } = useCatalogAdmin();
  const [newName, setNewName] = useState('');
  const [newError, setNewError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState(null);

  if (loading) return <PageMessage title="Cargando categorías..." />;
  if (error) return <PageMessage icon="error" title="Ocurrió un error" text={error} />;

  // Por categoría: total de productos y cuántos están activos (solo los activos impiden eliminarla)
  const productCount = products.reduce((counts, product) => {
    const current = counts.get(product.categoryId) ?? { total: 0, active: 0 };
    return counts.set(product.categoryId, {
      total: current.total + 1,
      active: current.active + Number(product.active),
    });
  }, new Map());
  const sorted = [...categories].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));

  /**
   * Crea una categoría.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Envío
   * @returns {Promise<void>}
   */
  const handleCreate = async (event) => {
    event.preventDefault();
    const validation = validateCategoryName(newName, categories);
    setNewError(validation);
    if (validation) return;
    if (await saveCategory(null, newName.trim())) setNewName('');
  };

  /**
   * Entra en modo edición de una fila.
   *
   * @param {Object} category - Categoría
   * @returns {void}
   */
  const startEdit = (category) => {
    clearActionError();
    setEditingId(category.id);
    setEditName(category.name);
    setEditError(null);
  };

  /**
   * Guarda el nuevo nombre.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Envío
   * @returns {Promise<void>}
   */
  const handleRename = async (event) => {
    event.preventDefault();
    const validation = validateCategoryName(editName, categories, editingId);
    setEditError(validation);
    if (validation) return;
    if (await saveCategory(editingId, editName.trim())) setEditingId(null);
  };

  /**
   * Elimina (desactiva) una categoría tras confirmar.
   *
   * @param {Object} category - Categoría
   * @returns {void}
   */
  const handleDelete = (category) => {
    if (window.confirm(`¿Eliminar la categoría "${category.name}"?`)) removeCategory(category.id);
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Categorías</h1>
      </header>

      {actionError && <div role="alert" className="admin-alert-error">{actionError}</div>}

      <form className="admin-card admin-inline-form" onSubmit={handleCreate} noValidate>
        <label className="admin-field admin-field-grow">
          <span className="admin-field-label">Nueva categoría</span>
          <input className="admin-input" value={newName} onChange={(event) => setNewName(event.target.value)} disabled={pending} placeholder="Nombre" />
          {newError && <span className="admin-field-error">{newError}</span>}
        </label>
        <button type="submit" className="admin-primary-btn" disabled={pending}>
          <span className="material-symbols-outlined">add</span>
          Crear
        </button>
      </form>

      {sorted.length === 0 ? (
        <PageMessage icon="category" title="No hay categorías" text="Crea la primera." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="admin-cell-number">Activos / total</th>
                <th>Estado</th>
                <th className="admin-cell-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(category => {
                const count = productCount.get(category.id) ?? { total: 0, active: 0 };

                return (
                  <tr key={category.id} className={category.active ? '' : 'admin-row-muted'}>
                    <td>
                      {editingId === category.id ? (
                        <form id={`rename-${category.id}`} onSubmit={handleRename} noValidate>
                          <input
                            className="admin-input"
                            aria-label="Nuevo nombre"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            disabled={pending}
                            autoFocus
                          />
                          {editError && <span className="admin-field-error">{editError}</span>}
                        </form>
                      ) : (
                        <span className="admin-cell-title">{category.name}</span>
                      )}
                    </td>
                    <td className="admin-cell-number">
                      {count.active}
                      <span className="admin-muted"> / {count.total}</span>
                    </td>
                    <td>
                      <Badge variant={category.active ? 'success' : 'neutral'}>{category.active ? 'Activa' : 'Inactiva'}</Badge>
                    </td>
                    <td className="admin-cell-actions">
                      {editingId === category.id ? (
                        <>
                          <button type="submit" form={`rename-${category.id}`} className="admin-link-btn" disabled={pending}>
                            Guardar
                          </button>
                          <button className="admin-link-btn" onClick={() => setEditingId(null)} disabled={pending}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="admin-link-btn" onClick={() => startEdit(category)} disabled={pending}>
                            Renombrar
                          </button>
                          {category.active && (
                            <button
                              className="admin-link-btn admin-link-btn-danger"
                              onClick={() => handleDelete(category)}
                              disabled={pending || count.active > 0}
                              title={count.active > 0 ? 'Tiene productos activos: muévelos o desactívalos primero' : undefined}
                            >
                              Eliminar
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
