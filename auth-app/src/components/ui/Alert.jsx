/**
 * Alert — Mensaje de retroalimentación para el usuario.
 *
 * @param {'error' | 'success'} variant
 */
function Alert({ children, variant = 'error' }) {
  return (
    <div role="alert" className={`alert-${variant}`}>
      {children}
    </div>
  )
}

export default Alert
