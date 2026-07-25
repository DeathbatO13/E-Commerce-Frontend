/**
 * Button — Botón reutilizable con variantes y estado de carga.
 *
 * @param {'primary' | 'outline'} variant
 * @param {boolean} loading  — Muestra estado de carga y deshabilita el botón
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
