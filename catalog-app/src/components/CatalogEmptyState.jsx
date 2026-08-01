/**
 * Componente CatalogEmptyState.
 * Propósito: Informar de forma clara que un filtro no devolvió productos, sin introducir datos de ejemplo.
 *
 * @param {{ title?: string, description?: string }} props - Texto configurable para estados vacíos o de error.
 * @returns {JSX.Element} Estado vacío del catálogo
 * @sideeffects Ninguno
 */
function CatalogEmptyState({ title = 'Aún no hay productos para mostrar', description = 'Cuando el servicio de catálogo tenga productos disponibles, aparecerán aquí.' }) {
  return (
    <div className="catalog-empty-state">
      <p className="catalog-empty-state-title">{title}</p>
      <p className="catalog-empty-state-description">{description}</p>
    </div>
  )
}

export default CatalogEmptyState