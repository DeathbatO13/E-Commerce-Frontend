import { Routes, Route, Suspense, lazy } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

// Microfrontends cargados dinámicamente vía Module Federation
const AuthApp    = lazy(() => import('authApp/AuthApp'));
const CatalogApp = lazy(() => import('catalogApp/CatalogApp'));
const CartApp    = lazy(() => import('cartApp/CartApp'));
const OrdersApp  = lazy(() => import('ordersApp/OrdersApp'));
const AdminApp   = lazy(() => import('adminApp/AdminApp'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        <p className="text-sm text-gray-400">Cargando módulo…</p>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth */}
          <Route path="/login"    element={<AuthApp />} />
          <Route path="/register" element={<AuthApp />} />

          {/* Cart */}
          <Route path="/cart" element={<CartApp />} />

          {/* Orders */}
          <Route path="/orders/*" element={<OrdersApp />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Catalog — catch-all (debe ir al final) */}
          <Route path="/*" element={<CatalogApp />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default AppRouter;
