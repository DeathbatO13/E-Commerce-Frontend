import { Link } from 'react-router-dom';

/**
 * Componente PageMessage.
 * Propósito: Mostrar estados de página completos (cargando, error o vacío) con un enlace opcional.
 *
 * @param {Object} props
 * @param {string} [props.icon] - Nombre del icono de Material Symbols
 * @param {string} props.title - Título del mensaje
 * @param {string} [props.text] - Texto de apoyo
 * @param {{ to: string, label: string }} [props.link] - Enlace de salida
 * @returns {JSX.Element} Mensaje centrado
 */
function PageMessage({ icon, title, text, link }) {
  return (
    <div className="orders-page-message">
      {icon && <span className="material-symbols-outlined orders-page-message-icon">{icon}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {link && (
        <Link to={link.to} className="orders-back-link">
          <span className="material-symbols-outlined">arrow_back</span>
          {link.label}
        </Link>
      )}
    </div>
  );
}

export default PageMessage;
