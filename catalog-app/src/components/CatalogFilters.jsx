/**
 * Componente CatalogFilters.
 * Propósito: Permitir seleccionar una categoría y limitar el listado a productos activos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array<{ id: string, name: string }>} props.categories - Categorías disponibles
 * @param {{ categoryId: string, activeOnly: boolean }} props.filters - Valores actualmente editables
 * @param {function} props.onChange - Callback para modificar un filtro
 * @param {function} props.onApply - Callback para aplicar filtros
 * @param {function} props.onReset - Callback para restaurar filtros
 * @returns {JSX.Element} Panel lateral de filtros
 * @sideeffects Invoca callbacks en interacción del usuario
 */
function CatalogFilters({ categories, filters, onChange, onApply, onReset }) {
  return (
    <aside className="catalog-filters">
      <div className="catalog-filters-panel">
        <h3 className="catalog-filters-title">Filters</h3>

        <div className="catalog-filter-group">
          <h4 className="catalog-filter-label">Category</h4>
          <div className="catalog-filter-options">
            <div className="catalog-filter-option">
              <input
                checked={!filters.categoryId}
                className="catalog-filter-radio"
                id="cat-all"
                name="catalog-category"
                type="radio"
                onChange={() => onChange('categoryId', '')}
              />
              <label className="catalog-filter-text" htmlFor="cat-all">All Categories</label>
            </div>
            {categories.map(category => (
              <div key={category.id} className="catalog-filter-option">
                <input
                  checked={filters.categoryId === category.id}
                  className="catalog-filter-radio"
                  id={`cat-${category.id}`}
                  name="catalog-category"
                  type="radio"
                  onChange={() => onChange('categoryId', category.id)}
                />
                <label className="catalog-filter-text" htmlFor={`cat-${category.id}`}>{category.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="catalog-filter-group">
          <h4 className="catalog-filter-label">Price Range</h4>
          <input className="catalog-filter-range" max="1000" min="0" type="range" defaultValue="500" />
          <div className="catalog-filter-range-labels">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </div>

        <div className="catalog-filter-group">
          <h4 className="catalog-filter-label">Availability</h4>
          <label className="catalog-active-filter" htmlFor="availability-toggle">
            <input
              checked={filters.activeOnly}
              className="catalog-filter-checkbox"
              id="availability-toggle"
              type="checkbox"
              onChange={event => onChange('activeOnly', event.target.checked)}
            />
            <div className="catalog-filter-toggle"></div>
            <span className="catalog-filter-toggle-text">In Stock Only</span>
          </label>
        </div>

        <div className="catalog-filter-actions">
          <button className="catalog-filter-apply" type="button" onClick={onApply}>
            Apply Filters
          </button>
          <button className="catalog-filter-reset" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </aside>
  )
}

export default CatalogFilters