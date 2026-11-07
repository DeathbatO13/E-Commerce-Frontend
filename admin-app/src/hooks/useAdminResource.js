import { useState, useEffect, useCallback } from 'react';

/**
 * Hook custom useAdminResource.
 * Propósito: Patrón común de las secciones del panel: cargar datos al montar, ejecutar acciones de escritura
 * y volver a cargar, porque varias respuestas del backend vienen sin cuerpo (DELETE, cancelar, cambiar rol).
 *
 * @template T
 * @param {function(): Promise<T>} loader - Carga los datos; debe ser una función estable (definida fuera del componente)
 * @returns {{
 *   data: T|null,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   run: function(function(): Promise<unknown>): Promise<boolean>,
 *   clearActionError: function(): void,
 * }} Estado y ejecutor de acciones (`run` resuelve true si la acción salió bien)
 * @throws {None} Errores atrapados y expuestos en `error` (carga) o `actionError` (acciones)
 * @sideeffects Llama a `loader` al montar y después de cada acción
 */
export function useAdminResource(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [pending, setPending] = useState(false);

  // `loading` arranca en true, así que el efecto solo actualiza estado al resolver la promesa.
  useEffect(() => {
    let cancelled = false;

    loader()
      .then(result => {
        if (!cancelled) setData(result);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar los datos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [loader]);

  const run = useCallback(async (action) => {
    setPending(true);
    setActionError(null);
    try {
      await action();
      setData(await loader());
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setPending(false);
    }
  }, [loader]);

  const clearActionError = useCallback(() => setActionError(null), []);

  return { data, loading, error, actionError, pending, run, clearActionError };
}
