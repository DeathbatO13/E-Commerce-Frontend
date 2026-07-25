/**
 * Divider — Separador horizontal con etiqueta central.
 *
 * @param {string} label — Texto del centro (default: "o")
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
