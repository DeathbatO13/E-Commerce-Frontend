const CATALOG_BASE_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8082'

/**
 * Obtiene categorías públicas del catálogo.
 *
 * @returns {Promise<Array<{ id: string, name: string, description?: string }>>} Categorías disponibles
 * @throws {Error} Si el servicio no responde correctamente
 * @sideeffects Realiza una petición HTTP GET a /categories
 */
export async function getCategories() {
  const response = await fetch(`${CATALOG_BASE_URL}/categories`)
  return parseResponse(response, 'No fue posible cargar las categorías.')
}

/**
 * Obtiene productos públicos aplicando los filtros soportados por la API.
 *
 * @param {{ categoryId?: string, active?: boolean }} filters - Filtros del catálogo
 * @returns {Promise<Array<{ id: string, name: string, description?: string, price: number, active: boolean, category?: Object }>>} Productos encontrados
 * @throws {Error} Si el servicio no responde correctamente
 * @sideeffects Realiza una petición HTTP GET a /products
 */
export async function getProducts({ categoryId, active } = {}) {
  const params = new URLSearchParams()

  if (categoryId) params.set('categoryId', categoryId)
  if (typeof active === 'boolean') params.set('active', String(active))

  const query = params.toString()
  const response = await fetch(`${CATALOG_BASE_URL}/products${query ? `?${query}` : ''}`)
  return parseResponse(response, 'No fue posible cargar los productos.')
}

/**
 * Obtiene los detalles de un producto por su ID.
 *
 * @param {string} id - ID del producto
 * @returns {Promise<{ id: string, name: string, description?: string, price: number, active: boolean, category?: Object }>} Detalles del producto
 * @throws {Error} Si el producto no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /products/{id}
 */
export async function getProductById(id) {
  const response = await fetch(`${CATALOG_BASE_URL}/products/${id}`)
  return parseResponse(response, 'No fue posible cargar los detalles del producto.')
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