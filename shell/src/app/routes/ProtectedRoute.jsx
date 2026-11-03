import { Navigate, useLocation } from "react-router-dom";
import { useAuthSession } from "authApp/useAuth";

/**
 * Componente ProtectedRoute — Guard de rutas del Shell.
 * Propósito: Dejar pasar solo a usuarios con sesión (y, si se indica, con uno de los roles permitidos).
 * Es una validación de UI: el backend sigue siendo la autoridad (regla 7 de `docs/busines-rules.md`).
 *
 * - Sin sesión: redirige a `/login` guardando la ruta de origen en `state.from` para volver tras el login.
 * - Con sesión pero sin rol permitido: redirige a `/`.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido protegido
 * @param {Array<'CLIENT' | 'ADMIN' | 'SUPER_ADMIN'>} [props.roles] - Roles permitidos; si se omite, basta con tener sesión
 * @returns {JSX.Element} El contenido o una redirección
 * @throws {None}
 * @sideeffects Escucha cambios de sesión (vía `useAuthSession`): si el usuario cierra sesión, redirige
 */
function ProtectedRoute({ children, roles }) {
  const { session } = useAuthSession();
  const location = useLocation();

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
