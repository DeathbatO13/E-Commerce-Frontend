import { useState, useEffect } from 'react'
import { getCategories, getProductById, withCategoryNames } from '../services/catalogService'

/**
 * Carga un producto y le agrega `categoryName`. Si las categorías no cargan, el producto se muestra igual.
 *
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Producto con `categoryName`
 * @throws {Error} Si el producto no existe o el servicio falla
 * @sideeffects Peticiones HTTP GET a /products/{id} y /categories
 */
async function loadProduct(id) {
  const [product, categories] = await Promise.all([getProductById(id), getCategories().catch(() => [])])
  return withCategoryNames([product], categories)[0]
}

/**
 * Hook custom useProductDetail.
 * Propósito: Gestionar el estado de carga y error para obtener un producto específico.
 *
 * @param {string} id - ID del producto
 * @returns {{ product: Object|null, loading: boolean, error: string|null }} Estado de la petición
 */
export function useProductDetail(id) {
  // El resultado guarda el id al que pertenece: mientras no coincida con el id actual, se está cargando.
  // Así no hace falta resetear loading/error de forma síncrona dentro del efecto.
  const [result, setResult] = useState({ id: null, product: null, error: null })

  useEffect(() => {
    if (!id) return

    let isMounted = true

    loadProduct(id)
      .then(data => {
        if (isMounted) setResult({ id, product: data, error: null })
      })
      .catch(err => {
        if (isMounted) setResult({ id, product: null, error: err.message })
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const isCurrent = result.id === id

  return {
    product: isCurrent ? result.product : null,
    loading: Boolean(id) && !isCurrent,
    error: isCurrent ? result.error : null,
  }
}
