import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_ROLES } from '../../app/routes/roles';

/** Etiquetas en español de los roles. */
const ROLE_LABELS = { SUPER_ADMIN: 'Super admin', ADMIN: 'Administrador', CLIENT: 'Cliente' };

/**
 * Componente UserMenu — Avatar y menú de la sesión.
 * Propósito: Dar acceso a los pedidos, al panel (solo `ADMIN`/`SUPER_ADMIN`) y a cerrar sesión.
 * Se cierra al hacer click fuera, con Escape o al elegir una opción.
 *
 * @param {Object} props - Propiedades del componente
 * @param {{ email: string | null, role: string | null }} props.session - Sesión activa
 * @param {function(): void} props.onLogout - Cierra la sesión
 * @returns {JSX.Element} Avatar con menú desplegable
 * @sideeffects Mientras está abierto escucha clicks y teclado en `document`; recarga en `/` al cerrar sesión
 */
function UserMenu({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    /**
     * Cierra el menú si el click fue fuera de él.
     *
     * @param {MouseEvent} event - Click en el documento
     * @returns {void}
     */
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }

    /**
     * Cierra el menú con Escape.
     *
     * @param {KeyboardEvent} event - Tecla pulsada
     * @returns {void}
     */
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  /**
   * Cierra la sesión y recarga en el inicio. Con `navigate` ganaría `ProtectedRoute`, que manda a `/login`
   * desde una ruta protegida; la recarga además limpia lo que los remotos guardan en memoria.
   *
   * @returns {void}
   */
  const handleLogout = () => {
    onLogout();
    window.location.assign('/');
  };

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-avatar"
        aria-label="Menú de usuario"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(previous => !previous)}
      >
        {session.email?.charAt(0) ?? '?'}
      </button>

      {open && (
        <div className="user-menu-panel" role="menu">
          <div className="user-menu-header">
            <span className="user-menu-email">{session.email}</span>
            <span className="user-menu-role">{ROLE_LABELS[session.role] ?? session.role}</span>
          </div>
          <Link to="/orders" role="menuitem" className="user-menu-item" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">receipt_long</span>
            Mis pedidos
          </Link>
          {ADMIN_ROLES.includes(session.role) && (
            <Link to="/admin" role="menuitem" className="user-menu-item" onClick={() => setOpen(false)}>
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Panel de administración
            </Link>
          )}
          <button type="button" role="menuitem" className="user-menu-item" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
