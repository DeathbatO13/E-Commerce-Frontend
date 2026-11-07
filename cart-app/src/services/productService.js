/**
 * @fileoverview Lectura de productos del Catalog Service para enriquecer el carrito.
 * Propósito: La API del carrito solo devuelve `productId`, `quantity` y `price` (ver backlog §12);
 * este servicio completa nombre y categoría consultando `GET /products/{id}` y `GET /categories`.
 * Se puede eliminar cuando el Cart Service devuelva esos datos.
 */

const CATALOG_BASE_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8082';

/** Caché en memoria por productId para no repetir peticiones en cada cambio del carrito. */
const productCache = new Map();

/** Nombres de categoría por id; se piden una sola vez (el producto solo trae `categoryId`). */
let categoryNamesPromise = null;

/**
 * Agrega nombre y categoría a cada ítem del carrito.
 * Si un producto no se puede cargar, el ítem se devuelve igual con `name: null`.
 *
 * @param {Array<{ productId: string, quantity: number, price: number }>} items - Ítems del carrito
 * @returns {Promise<Array<{ productId: string, quantity: number, price: number, name: string|null, categoryName: string|null }>>} Ítems enriquecidos
 * @throws {None} Los errores por producto se toleran
 * @sideeffects Realiza peticiones HTTP GET a /products/{id} y /categories, y llena las cachés
 */
export async function enrichCartItems(items) {
  const [products, categoryNames] = await Promise.all([
    Promise.all(items.map(item => getProduct(item.productId))),
    getCategoryNames(),
  ]);

  return items.map((item, index) => ({
    ...item,
    name: products[index]?.name ?? null,
    categoryName: categoryNames.get(products[index]?.categoryId) ?? null,
  }));
}

/**
 * Obtiene el mapa id → nombre de las categorías, pidiéndolo una sola vez.
 * Si falla, devuelve un mapa vacío y permite reintentar en la siguiente llamada.
 *
 * @returns {Promise<Map<string, string>>} Nombres de categoría por id
 * @sideeffects Realiza una petición HTTP GET a /categories la primera vez
 */
function getCategoryNames() {
  if (!categoryNamesPromise) {
    categoryNamesPromise = fetch(`${CATALOG_BASE_URL}/categories`)
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then(categories => new Map(categories.map(category => [category.id, category.name])))
      .catch(() => {
        categoryNamesPromise = null;
        return new Map();
      });
  }
  return categoryNamesPromise;
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
