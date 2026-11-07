/**
 * @fileoverview Administración del catálogo (Catalog Service).
 * Propósito: CRUD de categorías y productos. Las lecturas son públicas; las escrituras exigen `ADMIN` o
 * `SUPER_ADMIN`. Los contratos salen del código del backend, que difiere de `catalog.yaml` (ver backlog §12):
 * `ProductResponse` trae `categoryId` y `stock` en lugar de un objeto `category`.
 *
 * Eliminar no borra: el backend desactiva (`active: false`). Un producto se reactiva con `PUT`.
 */

import { request } from './http';

const CATALOG_BASE_URL = import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:8082';

/**
 * @typedef {Object} Category
 * @property {string} id - UUID
 * @property {string} name - Nombre único
 * @property {boolean} active - False si fue eliminada (desactivada)
 */

/**
 * @typedef {Object} Product
 * @property {string} id - UUID
 * @property {string} name - Nombre
 * @property {string} description - Descripción
 * @property {number} price - Precio (> 0)
 * @property {number} stock - Unidades (>= 0)
 * @property {string} categoryId - UUID de la categoría
 * @property {boolean} active - False si fue eliminado (desactivado)
 */

/**
 * Lista todas las categorías, incluidas las desactivadas.
 *
 * @returns {Promise<Category[]>} Categorías
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /categories
 */
export async function getCategories() {
  return (await request(`${CATALOG_BASE_URL}/categories`, { errorMessage: 'No fue posible cargar las categorías.' })) ?? [];
}

/**
 * Crea una categoría.
 *
 * @param {string} name - Nombre (obligatorio y único)
 * @returns {Promise<Category>} Categoría creada
 * @throws {Error} Si el nombre ya existe (409) o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /categories
 */
export function createCategory(name) {
  return request(`${CATALOG_BASE_URL}/categories`, {
    method: 'POST',
    body: { name },
    errorMessage: 'No fue posible crear la categoría.',
  });
}

/**
 * Renombra una categoría.
 *
 * @param {string} id - UUID de la categoría
 * @param {string} name - Nuevo nombre
 * @returns {Promise<Category>} Categoría actualizada
 * @throws {Error} Si no existe o el servicio falla
 * @sideeffects Realiza una petición HTTP PUT a /categories/{id}
 */
export function updateCategory(id, name) {
  return request(`${CATALOG_BASE_URL}/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { name },
    errorMessage: 'No fue posible actualizar la categoría.',
  });
}

/**
 * Elimina (desactiva) una categoría.
 *
 * @param {string} id - UUID de la categoría
 * @returns {Promise<void>}
 * @throws {Error} Si tiene productos asociados (409) o el servicio falla
 * @sideeffects Realiza una petición HTTP DELETE a /categories/{id}
 */
export async function deleteCategory(id) {
  await request(`${CATALOG_BASE_URL}/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    errorMessage: 'No fue posible eliminar la categoría.',
  });
}

/**
 * Lista todos los productos, incluidos los desactivados.
 *
 * @returns {Promise<Product[]>} Productos
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /products
 */
export async function getProducts() {
  return (await request(`${CATALOG_BASE_URL}/products`, { errorMessage: 'No fue posible cargar los productos.' })) ?? [];
}

/**
 * Crea un producto (nace activo).
 *
 * @param {{ name: string, description: string, price: number, stock: number, categoryId: string }} product - Datos
 * @returns {Promise<Product>} Producto creado
 * @throws {Error} Si la categoría no existe (404), los datos son inválidos (400) o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /products
 */
export function createProduct({ name, description, price, stock, categoryId }) {
  return request(`${CATALOG_BASE_URL}/products`, {
    method: 'POST',
    body: { name, description, price, stock, categoryId },
    errorMessage: 'No fue posible crear el producto.',
  });
}

/**
 * Actualiza un producto. El backend reemplaza todos los campos, incluido `active`.
 *
 * @param {string} id - UUID del producto
 * @param {{ name: string, description: string, price: number, stock: number, categoryId: string, active: boolean }} product - Datos completos
 * @returns {Promise<Product>} Producto actualizado
 * @throws {Error} Si no existe (404), los datos son inválidos (400) o el servicio falla
 * @sideeffects Realiza una petición HTTP PUT a /products/{id}
 */
export function updateProduct(id, { name, description, price, stock, categoryId, active }) {
  return request(`${CATALOG_BASE_URL}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { name, description, price, stock, categoryId, active },
    errorMessage: 'No fue posible actualizar el producto.',
  });
}

/**
 * Elimina (desactiva) un producto.
 *
 * @param {string} id - UUID del producto
 * @returns {Promise<void>}
 * @throws {Error} Si el servicio falla
 * @sideeffects Realiza una petición HTTP DELETE a /products/{id}
 */
export async function deleteProduct(id) {
  await request(`${CATALOG_BASE_URL}/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    errorMessage: 'No fue posible eliminar el producto.',
  });
}
