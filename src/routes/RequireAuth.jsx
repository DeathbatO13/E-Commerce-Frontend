import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // evita flicker

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
