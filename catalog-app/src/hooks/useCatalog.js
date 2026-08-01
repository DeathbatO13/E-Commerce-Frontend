import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../services/catalogService'

/**
 * Hook custom useCatalog.
 * Propósito: Cargar las categorías y los productos públicos, manteniendo los estados asíncronos de la UI.
 *
 * @param {{ categoryId?: string, active?: boolean }} filters - Filtros aplicados al listado
 * @returns {{ categories: Array, products: Array, loading: boolean, error: string | null }} Datos y estado de carga del catálogo
 * @sideeffects Realiza llamadas HTTP cuando los filtros cambian
 */
export function useCatalog({ categoryId, active }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    /** Carga las categorías una única vez al montar el catálogo. */
    async function loadCategories() {
      try {
        const data = await getCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    loadCategories()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false

    /** Carga productos al cambiar los filtros aplicados. */
    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProducts({ categoryId, active })
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) {
          setProducts([])
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [categoryId, active])

  return { categories, products, loading, error }
}