/**
 * @fileoverview Usuarios y roles (Auth Service).
 * Propósito: Listar usuarios (`ADMIN` y `SUPER_ADMIN`) y cambiar su rol (solo `SUPER_ADMIN`).
 * Las rutas salen del código del backend (`/admin/users`), no de `auth.yaml`, que aún documenta `/users`
 * (ver backlog §12).
 */

import { request } from './http';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';

/** Roles que se pueden asignar: el backend rechaza asignar `SUPER_ADMIN`. */
export const ASSIGNABLE_ROLES = ['CLIENT', 'ADMIN'];

/**
 * Lista los usuarios registrados.
 *
 * @returns {Promise<Array<{ id: string, email: string, roles: string[], enabled: boolean }>>} Usuarios
 * @throws {Error} Si no hay permiso (403) o el servicio falla
 * @sideeffects Realiza una petición HTTP GET a /admin/users
 */
export async function getUsers() {
  return (await request(`${AUTH_BASE_URL}/admin/users`, { errorMessage: 'No fue posible cargar los usuarios.' })) ?? [];
}

/**
 * Reemplaza el rol de un usuario.
 *
 * @param {string} id - UUID del usuario
 * @param {'CLIENT'|'ADMIN'} role - Nuevo rol
 * @returns {Promise<void>}
 * @throws {Error} Si el usuario es `SUPER_ADMIN` (409), el rol no es válido (400), no hay permiso o el servicio falla
 * @sideeffects Realiza una petición HTTP POST a /admin/users/{id}/role
 */
export async function changeUserRole(id, role) {
  const query = new URLSearchParams({ role });
  await request(`${AUTH_BASE_URL}/admin/users/${encodeURIComponent(id)}/role?${query}`, {
    method: 'POST',
    errorMessage: 'No fue posible cambiar el rol.',
  });
}
