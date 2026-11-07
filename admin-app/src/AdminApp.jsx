import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersAdminPage from './pages/OrdersAdminPage';
import UsersPage from './pages/UsersPage';

/**
 * Componente AdminApp — Microfrontend de Administración.
 * Propósito: Panel para gestionar catálogo, pedidos globales y usuarios.
 * Expuesto vía Module Federation como: adminApp/AdminApp. El Shell la monta en `/admin/*` y solo deja
 * entrar a `ADMIN` y `SUPER_ADMIN` (`ProtectedRoute`); las rutas de aquí son relativas a `/admin`.
 * Es una validación de UI: el backend sigue siendo la autoridad (regla 7).
 *
 * @returns {JSX.Element} Rutas del panel
 * @throws {None}
 * @sideeffects Ninguno
 */
function AdminApp() {
  return (
    <div className="admin-app-shell">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AdminApp;
