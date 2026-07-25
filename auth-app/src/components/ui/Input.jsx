/**
 * Input — Campo de texto con label integrado.
 *
 * Acepta todos los atributos nativos de <input>.
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
