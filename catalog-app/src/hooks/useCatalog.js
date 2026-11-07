import { useEffect, useMemo, useState } from 'react'
import { getCategories, getProducts, withCategoryNames } from '../services/catalogService'
import { getAvailability } from '../utils/availability'

/**
 * Hook custom useCatalog.
 * Propósito: Cargar las categorías y los productos públicos, manteniendo los estados asíncronos de la UI.
 * La API solo filtra por categoría; "solo disponibles" y la búsqueda por nombre se aplican aquí, porque
 * `GET /products` no filtra por `active` ni por stock, ni combina nombre con categoría.
 *
 * @param {{ categoryId?: string, availableOnly?: boolean, search?: string }} filters - Filtros aplicados al listado
 * @returns {{ categories: Array, products: Array, loading: boolean, error: string | null }} Categorías activas,
 *   productos con `categoryName` y estado de carga
 * @sideeffects Realiza llamadas HTTP cuando cambia la categoría
 */
export function useCatalog({ categoryId, availableOnly, search = '' }) {
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

    /** Carga productos al cambiar la categoría aplicada. */
    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProducts({ categoryId })
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
  }, [categoryId])

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return withCategoryNames(products, categories).filter(product =>
      (!availableOnly || getAvailability(product).purchasable)
      && (!term || product.name.toLowerCase().includes(term)))
  }, [products, categories, availableOnly, search])

  const activeCategories = useMemo(() => categories.filter(category => category.active !== false), [categories])

  return { categories: activeCategories, products: visibleProducts, loading, error }
}
