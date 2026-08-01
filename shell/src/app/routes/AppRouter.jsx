import { Routes, Route, Suspense, lazy } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import CatalogPage from "../../../../catalog-app/src/pages/CatalogPage";

// Microfrontends cargados dinámicamente vía Module Federation
const AuthApp    = lazy(() => import('authApp/AuthApp'));
const CartApp    = lazy(() => import('cartApp/CartApp'));
const OrdersApp  = lazy(() => import('ordersApp/OrdersApp'));
const AdminApp   = lazy(() => import('adminApp/AdminApp'));

function HomeFallback() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Bienvenido a ReactStore</h1>
      <p className="mt-2 text-sm text-slate-600">El catálogo remoto se cargará cuando el entorno de preview esté listo.</p>
    </div>
  );
}

/**
 * Componente LoadingFallback — Pantalla de carga genérica.
 * Propósito: Mostrar un spinner mientras se carga asíncronamente un Microfrontend remoto.
 * 
 * @returns {JSX.Element} Pantalla de carga
 * @throws {None}
 * @sideeffects Ninguno
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <p className="text-sm text-gray-400">Cargando módulo…</p>
      </div>
    </div>
  );
}

/**
 * Componente AppRouter — Sistema de enrutamiento global.
 * Propósito: Orquestar las rutas de la aplicación Shell y montar los Microfrontends (remotos) bajo demanda (lazy).
 * 
 * @returns {JSX.Element} Declaración de rutas de la aplicación
 * @throws {None}
 * @sideeffects Puede suspender el renderizado mientras carga dependencias remotas
 */
function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ── Auth: sin MainLayout (pantalla completa propia) ── */}
        <Route path="/login"    element={<AuthApp />} />
        <Route path="/register" element={<AuthApp />} />

        {/* ── Resto: con MainLayout (header + footer globales) ── */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/cart"      element={<CartApp />} />
              <Route path="/orders/*"  element={<OrdersApp />} />
              <Route path="/admin/*"   element={<AdminApp />} />
              <Route path="/"          element={<HomeFallback />} />
              <Route path="/*"         element={<CatalogPage />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
