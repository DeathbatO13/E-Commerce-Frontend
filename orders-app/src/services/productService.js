/**
 * @fileoverview Lectura de productos del Catalog Service para enriquecer ítems.
 * Propósito: El carrito y los pedidos solo devuelven `productId`, `quantity` y `price` (ver backlog §12);
 * este servicio completa el nombre consultando `GET /products/{id}`.
 */

const CATALOG_BASE_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8082';

/** Caché en memoria por productId para no repetir peticiones entre páginas. */
const productCache = new Map();

/**
 * Agrega el nombre del producto a cada ítem.
 * Si un producto no se puede cargar (p. ej. fue eliminado), el ítem se devuelve con `name: null`.
 *
 * @param {Array<{ productId: string, quantity: number, price: number }>} items - Ítems a enriquecer
 * @returns {Promise<Array<{ productId: string, quantity: number, price: number, name: string|null }>>} Ítems enriquecidos
 * @throws {None} Los errores por producto se toleran
 * @sideeffects Realiza peticiones HTTP GET a /products/{id} y llena la caché
 */
export async function enrichItems(items) {
  const products = await Promise.all(items.map(item => getProduct(item.productId)));
  return items.map((item, index) => ({ ...item, name: products[index]?.name ?? null }));
}

/**
 * Obtiene un producto usando la caché; devuelve null si falla.
 *
 * @param {string} productId - ID del producto
 * @returns {Promise<Object|null>} Producto o null
 * @sideeffects Realiza una petición HTTP GET a /products/{id} si no está en caché
 */
async function getProduct(productId) {
  if (productCache.has(productId)) return productCache.get(productId);

  try {
    const response = await fetch(`${CATALOG_BASE_URL}/products/${encodeURIComponent(productId)}`);
    if (!response.ok) return null;
    const product = await response.json();
    productCache.set(productId, product);
    return product;
  } catch {
    return null;
  }
}
