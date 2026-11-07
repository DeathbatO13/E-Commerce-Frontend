import { Link } from "react-router-dom";

/**
 * Componente NotFoundPage — Página 404.
 * Propósito: Responder a las rutas que no pertenecen a ningún microfrontend.
 *
 * @returns {JSX.Element} Mensaje con enlace al inicio
 * @throws {None}
 * @sideeffects Ninguno
 */
export function NotFoundPage() {
  return (
    <div className="shell-message">
      <span className="material-symbols-outlined shell-message-icon">search_off</span>
      <h1 className="shell-message-title">Página no encontrada</h1>
      <p className="shell-message-text">La dirección que buscas no existe o cambió de lugar.</p>
      <Link to="/" className="shell-message-action">Volver al inicio</Link>
    </div>
  );
}

/**
 * Componente RemoteUnavailable — Aviso de microfrontend caído.
 * Propósito: Fallback visible de `RemoteErrorBoundary`. React guarda el fallo de un `lazy`, así que reintentar
 * exige recargar la página.
 *
 * @returns {JSX.Element} Mensaje con botón para recargar
 * @throws {None}
 * @sideeffects Recarga la página al pulsar "Reintentar"
 */
export function RemoteUnavailable() {
  return (
    <div role="alert" className="shell-message">
      <span className="material-symbols-outlined shell-message-icon">cloud_off</span>
      <h1 className="shell-message-title">Esta sección no está disponible</h1>
      <p className="shell-message-text">No pudimos cargarla. Inténtalo de nuevo en unos momentos.</p>
      <button type="button" className="shell-message-action" onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  );
}
