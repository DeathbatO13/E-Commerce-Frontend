/**
 * Componente Alert — Mensaje de retroalimentación visual para el usuario.
 * Propósito: Muestra un contenedor con estilos de alerta (error o éxito).
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a mostrar dentro de la alerta
 * @param {'error' | 'success'} [props.variant='error'] - Variante visual de la alerta
 * @returns {JSX.Element} Un div con rol 'alert'
 * @throws {None}
 * @sideeffects Ninguno
 */
function Alert({ children, variant = 'error' }) {
  return (
    <div role="alert" className={`alert-${variant}`}>
      {children}
    </div>
  )
}

export default Alert
