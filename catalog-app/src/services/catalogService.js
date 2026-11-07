/**
 * @fileoverview Servicio público del catálogo.
 * Propósito: Consumir el Catalog Service con la forma que devuelve su código (difiere de `catalog.yaml`,
 * ver backlog §12): un producto es `{ id, name, description, price, stock, categoryId, active }`, sin el
 * objeto `category`, y `GET /products` solo filtra por `categoryId` (o `name`), no por `active`.
 */

const CATALOG_BASE_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8082'

/**
 * @typedef {Object} Product
 * @property {string} id - UUID
 * @property {string} name - Nombre
 * @property {string} description - Descripción
 * @property {number} price - Precio
 * @property {number} stock - Unidades disponibles
 * @property {string} categoryId - UUID de la categoría
 * @property {boolean} active - False si el producto fue deshabilitado (regla 3.2)
 */

/**
 * Obtiene las categorías del catálogo, incluidas las desactivadas.
 *
 * @returns {Promise<Array<{ id: string, name: string, active: boolean }>>} Categorías
 * @throws {Error} Si el servicio no responde correctamente
 * @sideeffects Realiza una petición HTTP GET a /categories
 */
export async function getCategories() {
  const response = await fetch(`${CATALOG_BASE_URL}/categories`)
  return parseResponse(response, 'No fue posible cargar las categorías.')
}

/**
 * Obtiene los productos, opcionalmente de una categoría.
 * La API devuelve también los productos deshabilitados; filtrarlos es tarea de la UI.
 *
 * @param {{ categoryId?: string }} [filters] - Filtros soportados por la API
 * @returns {Promise<Product[]>} Productos encontrados
 * @throws {Error} Si el servicio no responde correctamente
 * @sideeffects Realiza una petición HTTP GET a /products
 */
export async function getProducts({ categoryId } = {}) {
  const query = categoryId ? `?${new URLSearchParams({ categoryId })}` : ''
  const response = await fetch(`${CATALOG_BASE_URL}/products${query}`)
  return parseResponse(response, 'No fue posible cargar los productos.')
}

/**
 * Obtiene los detalles de un producto por su ID.
 *
 * @param {string} id - ID del producto
 * @returns {Promise<Product>} Detalles del producto
 * @throws {Error} Si el producto no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /products/{id}
 */
export async function getProductById(id) {
  const response = await fetch(`${CATALOG_BASE_URL}/products/${encodeURIComponent(id)}`)
  return parseResponse(response, 'No fue posible cargar los detalles del producto.')
}

/**
 * Agrega a cada producto el nombre de su categoría (`categoryName`), resolviendo `categoryId`.
 *
 * @param {Product[]} products - Productos de la API
 * @param {Array<{ id: string, name: string }>} categories - Categorías de la API
 * @returns {Array<Product & { categoryName: string|null }>} Productos con el nombre de la categoría
 */
export function withCategoryNames(products, categories) {
  const names = new Map(categories.map(category => [category.id, category.name]))
  return products.map(product => ({ ...product, categoryName: names.get(product.categoryId) ?? null }))
}

/**
 * Convierte una respuesta HTTP del catálogo a JSON o lanza un error usable por la UI.
 *
 * @param {Response} response - Respuesta de Fetch
 * @param {string} fallbackMessage - Mensaje de error por defecto
 * @returns {Promise<unknown>} Cuerpo JSON de la respuesta
 * @throws {Error} Si la respuesta no es exitosa
 * @sideeffects Consume el cuerpo de la respuesta
 */
async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage)
  }

  return data
}
