import { useAuthSession } from 'authApp/useAuth';
import { useUsers } from '../hooks/useUsers';
import { ASSIGNABLE_ROLES } from '../services/usersService';
import PageMessage from '../components/PageMessage';
import Badge from '../components/Badge';
import { ROLE_LABELS } from '../utils/format';

/** Color de la etiqueta por rol. */
const ROLE_VARIANTS = { SUPER_ADMIN: 'danger', ADMIN: 'info', CLIENT: 'neutral' };

/**
 * Componente UsersPage — Usuarios y roles.
 * Propósito: `ADMIN` y `SUPER_ADMIN` ven el listado (regla 6.2); solo `SUPER_ADMIN` cambia roles entre
 * `CLIENT` y `ADMIN`. Nadie puede asignar `SUPER_ADMIN` ni cambiar el rol de un `SUPER_ADMIN`.
 *
 * @returns {JSX.Element} Tabla de usuarios
 * @throws {None}
 * @sideeffects Usa `useUsers` (Auth Service) y `useAuthSession`
 */
function UsersPage() {
  const { session } = useAuthSession();
  const { users, loading, error, actionError, pending, changeRole } = useUsers();
  const canChangeRoles = session.role === 'SUPER_ADMIN';

  if (loading) return <PageMessage title="Cargando usuarios..." />;
  if (error) return <PageMessage icon="error" title="Ocurrió un error" text={error} />;

  /**
   * Cambia el rol tras confirmar.
   *
   * @param {Object} user - Usuario
   * @param {string} role - Nuevo rol
   * @returns {void}
   */
  const handleRoleChange = (user, role) => {
    if (window.confirm(`¿Cambiar el rol de ${user.email} a ${ROLE_LABELS[role]}?`)) changeRole(user.id, role);
  };

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Usuarios</h1>
      </header>

      {!canChangeRoles && (
        <div role="status" className="admin-alert-info">Solo un super admin puede cambiar roles.</div>
      )}
      {actionError && <div role="alert" className="admin-alert-error">{actionError}</div>}

      {users.length === 0 ? (
        <PageMessage icon="group" title="No hay usuarios" />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                {canChangeRoles && <th className="admin-cell-actions">Cambiar rol</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
                const currentRole = ASSIGNABLE_ROLES.find(role => user.roles.includes(role)) ?? '';

                return (
                  <tr key={user.id} className={user.enabled ? '' : 'admin-row-muted'}>
                    <td className="admin-cell-title">{user.email}</td>
                    <td>
                      {user.roles.map(role => (
                        <Badge key={role} variant={ROLE_VARIANTS[role]}>{ROLE_LABELS[role] ?? role}</Badge>
                      ))}
                    </td>
                    <td>
                      <Badge variant={user.enabled ? 'success' : 'neutral'}>{user.enabled ? 'Habilitado' : 'Deshabilitado'}</Badge>
                    </td>
                    {canChangeRoles && (
                      <td className="admin-cell-actions">
                        {isSuperAdmin ? (
                          <span className="admin-muted">No modificable</span>
                        ) : (
                          <select
                            className="admin-input admin-select"
                            aria-label={`Rol de ${user.email}`}
                            value={currentRole}
                            onChange={(event) => handleRoleChange(user, event.target.value)}
                            disabled={pending}
                          >
                            {ASSIGNABLE_ROLES.map(role => (
                              <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
