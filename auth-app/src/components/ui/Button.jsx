/**
 * Componente Button — Botón reutilizable con variantes y estado de carga.
 * Propósito: Renderizar un botón HTML estilizado que opcionalmente muestra un spinner de carga.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {'primary' | 'outline'} [props.variant='primary'] - Estilo visual del botón
 * @param {boolean} [props.loading=false] - Si es true, deshabilita el botón y muestra un spinner
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Elemento button interactivo
 * @throws {None}
 * @sideeffects Ninguno
 */
function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading
        ? <><Spinner /> <span>Cargando…</span></>
        : children
      }
    </button>
  )
}

/**
 * Componente Spinner — Indicador de carga.
 * Propósito: Renderizar un ícono SVG animado para indicar que un proceso está en curso.
 * 
 * @returns {JSX.Element} Elemento SVG giratorio
 * @throws {None}
 * @sideeffects Ninguno
 */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

export default Button
