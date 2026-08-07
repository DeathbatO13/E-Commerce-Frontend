import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogFilters from '../components/CatalogFilters'
import ProductCard from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'

const DEFAULT_FILTERS = { categoryId: '', activeOnly: true }

/**
 * Componente CatalogPage.
 * Propósito: Orquestar filtros, carga del catálogo y presentación del listado público de productos.
 *
 * @returns {JSX.Element} Página principal del catálogo
 * @sideeffects Consume el hook useCatalog para cargar datos remotos
 */
function CatalogPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const { categories, products, loading, error } = useCatalog({
    categoryId: appliedFilters.categoryId,
    active: appliedFilters.activeOnly || undefined,
  })

  /**
   * Actualiza un filtro sin realizar la petición hasta que el usuario aplique los cambios.
   *
   * @param {string} field - Campo del filtro
   * @param {string | boolean} value - Nuevo valor
   * @returns {void}
   */
  function updateFilter(field, value) {
    setDraftFilters(previous => ({ ...previous, [field]: value }))
  }

  /**
   * Aplica la selección actual de filtros al listado.
   *
   * @returns {void}
   */
  function applyFilters() {
    setAppliedFilters(draftFilters)
  }

  /**
   * Restaura filtros y listado a su estado inicial.
   *
   * @returns {void}
   */
  function resetFilters() {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="catalog-page">
      <CatalogFilters
        categories={categories}
        filters={draftFilters}
        onApply={applyFilters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      <div className="catalog-content">
        <div className="catalog-header">
          <h1 className="catalog-title">Our Products</h1>
          <p className="catalog-subtitle">Browse through our collection of high-quality products.</p>
        </div>

        {loading && <p className="catalog-loading">Cargando productos…</p>}
        {!loading && error && (
          <CatalogEmptyState
            title="No se pudo comunicar con el servidor"
            description="El servicio de catálogo está temporalmente no disponible. Intenta nuevamente en unos momentos."
          />
        )}
        {!loading && !error && products.length === 0 && <CatalogEmptyState />}
        {!loading && !error && products.length > 0 && (
          <div className="catalog-product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={navigate}
              />
            ))}
          </div>
        )}

        <div className="pagination-container">
          <a className="pagination-link-icon" href="#">
            <span className="material-symbols-outlined">chevron_left</span>
          </a>
          <a className="pagination-link-active" href="#">1</a>
          <a className="pagination-link" href="#">2</a>
          <a className="pagination-link" href="#">3</a>
          <span className="pagination-ellipsis">...</span>
          <a className="pagination-link" href="#">10</a>
          <a className="pagination-link-icon" href="#">
            <span className="material-symbols-outlined">chevron_right</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage