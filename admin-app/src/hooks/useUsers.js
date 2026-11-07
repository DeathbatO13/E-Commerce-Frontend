import { useAdminResource } from './useAdminResource';
import { getUsers, changeUserRole } from '../services/usersService';

/**
 * Hook custom useUsers.
 * Propósito: Listado de usuarios y cambio de rol (el backend solo lo permite a `SUPER_ADMIN`).
 *
 * @returns {{
 *   users: Array<{ id: string, email: string, roles: string[], enabled: boolean }>,
 *   loading: boolean,
 *   error: string|null,
 *   actionError: string|null,
 *   pending: boolean,
 *   changeRole: function(string, string): Promise<boolean>,
 * }} Estado y acción
 * @throws {None}
 * @sideeffects Peticiones HTTP al Auth Service
 */
export function useUsers() {
  const { data, loading, error, actionError, pending, run } = useAdminResource(getUsers);

  return {
    users: data ?? [],
    loading,
    error,
    actionError,
    pending,
    changeRole: (id, role) => run(() => changeUserRole(id, role)),
  };
}
