import { emit, CART_ADD_ITEM } from 'shellApp/eventBus'
import { getSession } from 'authApp/authService'

/**
 * Componente ProductCard.
 * Propósito: Presentar los datos públicos de un producto y permitir agregarlo al carrito.
 * Si el usuario no está autenticado, redirige a `/login` antes de emitir el evento.
 * Si el producto está inactivo (out of stock), el botón se deshabilita.
 *
 * @param {Object} props - Propiedades del componente
 * @param {{ id: string, name: string, description?: string, price: number, active: boolean, category?: { name?: string } }} props.product - Producto a mostrar
 * @param {function} [props.onNavigate] - Función de navegación inyectada por el padre (permite redirigir sin depender directamente de react-router)
 * @returns {JSX.Element} Tarjeta de producto con botón de agregar al carrito
 * @sideeffects Emite el evento `CART_ADD_ITEM` en el eventBus al agregar un producto
 */
function ProductCard({ product, onNavigate }) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  /**
   * Maneja el click en el botón "Agregar al carrito".
   * Verifica autenticación antes de emitir el evento.
   * Si no hay sesión activa, redirige al login.
   *
   * @returns {void}
   * @sideeffects Emite `CART_ADD_ITEM` o redirige a /login
   */
  function handleAddToCart(e) {
    e.stopPropagation() // Prevent navigating when adding to cart
    const session = getSession()

    if (!session.isAuthenticated) {
      onNavigate?.('/login')
      return
    }

    emit(CART_ADD_ITEM, { productId: product.id, quantity: 1 })
  }

  function handleNavigateToDetail() {
    onNavigate?.(`/products/${product.id}`)
  }

  return (
    <div className="product-card">
      <div 
        className="product-card-image cursor-pointer" 
        aria-label={`Image of ${product.name}`}
        onClick={handleNavigateToDetail}
      ></div>
      <div className="product-card-body">
        <p className="product-card-category">{product.category?.name || 'Uncategorized'}</p>
        <p 
          className="product-card-title cursor-pointer hover:text-primary transition-colors"
          onClick={handleNavigateToDetail}
        >
          {product.name}
        </p>
        <div className="product-card-footer">
          <p className="product-card-price">{price}</p>
          <span className={`product-card-status ${product.active ? 'product-card-status-active' : 'product-card-status-inactive'}`}>
            {product.active ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      <button
        className={`product-card-add-btn ${product.active ? 'product-card-add-btn-active' : 'product-card-add-btn-inactive'}`}
        onClick={handleAddToCart}
        disabled={!product.active}
        aria-label={product.active ? `Agregar ${product.name} al carrito` : `${product.name} sin stock`}
        title={product.active ? 'Agregar al carrito' : 'Sin stock'}
      >
        <span className="material-symbols-outlined product-card-add-icon">
          {product.active ? 'add_shopping_cart' : 'remove_shopping_cart'}
        </span>
      </button>
    </div>
  )
}

export default ProductCard