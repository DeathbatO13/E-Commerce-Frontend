import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProductDetail } from '../hooks/useProductDetail'
import CatalogEmptyState from '../components/CatalogEmptyState'
import { emit, CART_ADD_ITEM } from 'shellApp/eventBus'
import { getSession } from 'authApp/authService'

/**
 * Componente ProductDetailPage.
 * Propósito: Mostrar los detalles de un producto y permitir agregarlo al carrito.
 */
function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProductDetail(id)

  function handleAddToCart() {
    const session = getSession()
    if (!session.isAuthenticated) {
      navigate('/login')
      return
    }
    emit(CART_ADD_ITEM, { productId: product.id, quantity: 1 })
  }

  if (loading) {
    return <div className="catalog-loading">Cargando detalles del producto…</div>
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-back">
          <Link to="/" className="product-detail-back-link">
            <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
          </Link>
        </div>
        <CatalogEmptyState
          title="Producto no encontrado"
          description={error || "El producto que buscas no existe o ha sido removido."}
        />
      </div>
    )
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <div className="product-detail-page">
      <div className="product-detail-back">
        <Link to="/" className="product-detail-back-link">
          <span className="material-symbols-outlined">arrow_back</span> Volver al catálogo
        </Link>
      </div>

      <div className="product-detail-content">
        <div className="product-detail-image-container">
           {/* Placeholder for product image */}
           <div className="product-detail-image-placeholder">
             <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.2 }}>inventory_2</span>
           </div>
        </div>

        <div className="product-detail-info">
          <p className="product-detail-category">{product.category?.name || 'Uncategorized'}</p>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">{price}</p>
          
          <div className="product-detail-status-container">
            <span className={`product-detail-status ${product.active ? 'product-detail-status-active' : 'product-detail-status-inactive'}`}>
              {product.active ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="product-detail-description">
            <h3>Descripción</h3>
            <p>{product.description || 'No hay descripción disponible para este producto.'}</p>
          </div>

          <button
            className={`product-detail-add-btn ${product.active ? 'product-detail-add-btn-active' : 'product-detail-add-btn-inactive'}`}
            onClick={handleAddToCart}
            disabled={!product.active}
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            {product.active ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
