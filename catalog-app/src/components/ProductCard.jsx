/**
 * Componente ProductCard.
 * Propósito: Presentar los datos públicos de un producto sin depender todavía de imágenes ni del carrito.
 *
 * @param {Object} props - Propiedades del componente
 * @param {{ name: string, description?: string, price: number, active: boolean, category?: { name?: string } }} props.product - Producto a mostrar
 * @returns {JSX.Element} Tarjeta de producto
 * @sideeffects Ninguno
 */
function ProductCard({ product }) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <div className="product-card group">
      <div className="product-card-image" aria-label={`Image of ${product.name}`}></div>
      <div className="product-card-body">
        <p className="product-card-category">{product.category?.name || 'Uncategorized'}</p>
        <p className="product-card-title">{product.name}</p>
        <div className="product-card-footer">
          <p className="product-card-price">{price}</p>
          <span className={`product-card-status ${product.active ? 'product-card-status-active' : 'product-card-status-inactive'}`}>
            {product.active ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      <button
        className={`product-card-add-btn group-hover:translate-y-0 group-hover:opacity-100 ${product.active ? 'product-card-add-btn-active' : 'product-card-add-btn-inactive'}`}
        disabled={!product.active}
      >
        <span className="material-symbols-outlined text-xl">{product.active ? 'add_shopping_cart' : 'remove_shopping_cart'}</span>
      </button>
    </div>
  )
}

export default ProductCard