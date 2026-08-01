/**
 * Componente Input — Campo de texto con label integrado.
 * Propósito: Renderizar un campo de formulario estandarizado con su etiqueta accesible.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto de la etiqueta (label)
 * @param {string} props.id - ID único para asociar el input al label
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Contenedor con label y elemento input
 * @throws {None}
 * @sideeffects Ninguno
 */
function Input({ label, id, className = '', ...props }) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-input ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input
