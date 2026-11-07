/**
 * Componente PageMessage.
 * Propósito: Mostrar estados de sección completos (cargando, error o vacío).
 *
 * @param {Object} props
 * @param {string} [props.icon] - Nombre del icono de Material Symbols
 * @param {string} props.title - Título del mensaje
 * @param {string} [props.text] - Texto de apoyo
 * @returns {JSX.Element} Mensaje centrado
 */
function PageMessage({ icon, title, text }) {
  return (
    <div className="admin-page-message">
      {icon && <span className="material-symbols-outlined admin-page-message-icon">{icon}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export default PageMessage;
