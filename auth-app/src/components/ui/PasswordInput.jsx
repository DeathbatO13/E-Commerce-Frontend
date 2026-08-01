import { useState } from 'react'

/**
 * Componente PasswordInput — Campo de contraseña con botón para revelar/ocultar el texto.
 * Propósito: Renderizar un input seguro que permite al usuario alternar la visibilidad de su contraseña.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto de la etiqueta (label)
 * @param {string} props.id - ID único para el campo
 * @param {React.ReactNode} [props.hint] - Contenido opcional adicional (ej: enlace para recuperar contraseña)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Input interactivo con ícono
 * @throws {None}
 * @sideeffects Mantiene estado local de visibilidad
 */
function PasswordInput({ label, id, hint, className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`form-input-icon ${className}`}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={() => setVisible(v => !v)}
          className="input-icon-btn"
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>

      {hint && <div className="text-right">{hint}</div>}
    </div>
  )
}

/* ── Iconos ── */

/**
 * Componente EyeOpenIcon — Ícono de ojo abierto.
 * Propósito: Representar visualmente el estado de "contraseña visible".
 * 
 * @returns {JSX.Element} Ícono SVG
 * @throws {None}
 * @sideeffects Ninguno
 */
function EyeOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

/**
 * Componente EyeClosedIcon — Ícono de ojo cerrado.
 * Propósito: Representar visualmente el estado de "contraseña oculta".
 * 
 * @returns {JSX.Element} Ícono SVG
 * @throws {None}
 * @sideeffects Ninguno
 */
function EyeClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.03-3.374M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.21 5.442M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3" />
    </svg>
  )
}

export default PasswordInput
