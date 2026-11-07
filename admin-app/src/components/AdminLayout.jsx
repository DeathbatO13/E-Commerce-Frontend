import { NavLink, Outlet } from 'react-router-dom';
import { useAuthSession } from 'authApp/useAuth';
import { ROLE_LABELS } from '../utils/format';

/** Secciones del panel. `end` evita que el Dashboard quede activo en todas las subrutas. */
const SECTIONS = [
  { to: '/admin', label: 'Resumen', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Productos', icon: 'inventory_2' },
  { to: '/admin/categories', label: 'Categorías', icon: 'category' },
  { to: '/admin/orders', label: 'Pedidos', icon: 'receipt_long' },
  { to: '/admin/users', label: 'Usuarios', icon: 'group' },
];

/**
 * Devuelve la clase del enlace del menú según si está activo.
 *
 * @param {{ isActive: boolean }} state - Estado que entrega NavLink
 * @returns {string} Clase CSS
 */
function navLinkClass({ isActive }) {
  return isActive ? 'admin-nav-link admin-nav-link-active' : 'admin-nav-link';
}

/**
 * Componente AdminLayout — Estructura del panel de administración.
 * Propósito: Menú lateral con las secciones y área de contenido (`Outlet`). El acceso por rol lo valida el
 * Shell (`ProtectedRoute` con `ADMIN`/`SUPER_ADMIN`); aquí solo se muestra el rol actual.
 *
 * @returns {JSX.Element} Layout con menú lateral
 * @throws {None}
 * @sideeffects Escucha cambios de sesión (vía `useAuthSession`)
 */
function AdminLayout() {
  const { session } = useAuthSession();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-title">Administración</span>
          <span className="admin-sidebar-role">{ROLE_LABELS[session.role] ?? session.role}</span>
        </div>
        <nav className="admin-nav" aria-label="Secciones del panel">
          {SECTIONS.map(section => (
            <NavLink key={section.to} to={section.to} end={section.end} className={navLinkClass}>
              <span className="material-symbols-outlined">{section.icon}</span>
              {section.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
