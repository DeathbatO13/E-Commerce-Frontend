import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // evita flicker mientras se resuelve el estado

  if (isAuthenticated) return <Navigate to="/" replace />;

  // Si se pasan `children`, renderízalos; si no, renderiza el <Outlet /> para rutas hijas
  return children ? children : <Outlet />;
}
