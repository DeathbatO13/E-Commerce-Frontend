import { useState, useEffect } from 'react'
import { getProductById } from '../services/catalogService'

/**
 * Hook custom useProductDetail.
 * Propósito: Gestionar el estado de carga y error para obtener un producto específico.
 *
 * @param {string} id - ID del producto
 * @returns {{ product: Object|null, loading: boolean, error: string|null }} Estado de la petición
 */
export function useProductDetail(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let isMounted = true
    setLoading(true)
    setError(null)

    getProductById(id)
      .then(data => {
        if (isMounted) setProduct(data)
      })
      .catch(err => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  return { product, loading, error }
}
