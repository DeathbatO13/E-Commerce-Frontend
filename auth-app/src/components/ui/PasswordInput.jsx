import { useState } from 'react'

/**
 * PasswordInput — Campo de contraseña con toggle de visibilidad.
 *
 * @param {string}      label      — Texto del label
 * @param {string}      id         — ID del input (para accesibilidad)
 * @param {ReactNode}   hint       — Contenido opcional debajo del input (ej: "¿Olvidaste tu contraseña?")
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

function EyeClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.03-3.374M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.21 5.442M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3" />
    </svg>
  )
}

export default PasswordInput
