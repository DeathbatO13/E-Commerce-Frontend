/**
 * Componente Divider — Separador horizontal con etiqueta central.
 * Propósito: Separar visualmente bloques de contenido con texto en medio.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.label='o'] - Texto a mostrar en el centro del separador
 * @returns {JSX.Element} Contenedor con dos líneas horizontales y un texto
 * @throws {None}
 * @sideeffects Ninguno
 */
function Divider({ label = 'o' }) {
  return (
    <div className="divider">
      <hr className="divider-line" />
      <span className="divider-label">{label}</span>
      <hr className="divider-line" />
    </div>
  )
}

export default Divider
