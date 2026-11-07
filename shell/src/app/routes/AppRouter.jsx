import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import RemoteErrorBoundary from "../components/RemoteErrorBoundary";
import { NotFoundPage, RemoteUnavailable } from "../components/ShellMessages";
import ProtectedRoute from "./ProtectedRoute";
import { ADMIN_ROLES } from "./roles";

// Microfrontends cargados dinámicamente vía Module Federation
const AuthApp     = lazy(() => import('authApp/AuthApp'));
const CatalogApp  = lazy(() => import('catalogApp/CatalogApp'));
const CartApp     = lazy(() => import('cartApp/CartApp'));
const OrdersApp   = lazy(() => import('ordersApp/OrdersApp'));
const AdminApp    = lazy(() => import('adminApp/AdminApp'));

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
    <div className="router-loading">
      <div className="router-loading-inner">
        <div className="router-loading-spinner" />
        <p className="router-loading-text">Cargando módulo…</p>
      </div>
    </div>
  );
}

/**
 * Componente RemoteBoundary — Carga segura de un microfrontend.
 * Propósito: Mostrar el spinner mientras carga el remoto y un aviso si falla, sin tumbar el Shell.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.section - Primer segmento de la ruta; reinicia el boundary al cambiar
 * @param {React.ReactNode} props.children - Contenido que carga el remoto
 * @returns {JSX.Element} Contenido protegido
 * @throws {None}
 * @sideeffects Puede suspender el renderizado mientras carga dependencias remotas
 */
function RemoteBoundary({ section, children }) {
  return (
    <RemoteErrorBoundary key={section} fallback={<RemoteUnavailable />}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </RemoteErrorBoundary>
  );
}

/**
 * Componente AppRouter — Sistema de enrutamiento global.
 * Propósito: Orquestar las rutas de la aplicación Shell y montar los Microfrontends (remotos) bajo demanda (lazy).
 * 
 * @returns {JSX.Element} Declaración de rutas de la aplicación
 * @throws {None}
 * @sideeffects Los remotos se cargan bajo demanda dentro de `RemoteBoundary`
 */
function AppRouter() {
  const { pathname } = useLocation();
  // Al cambiar de sección se reinicia el boundary: un remoto caído no bloquea a los demás
  const section = pathname.split("/")[1];

  return (
    <Routes>
      {/* ── Auth: sin MainLayout (pantalla completa propia) ── */}
      <Route path="/login"    element={<RemoteBoundary section={section}><AuthApp /></RemoteBoundary>} />
      <Route path="/register" element={<RemoteBoundary section={section}><AuthApp /></RemoteBoundary>} />

      {/* ── Resto: con MainLayout (header + footer globales) ── */}
      <Route path="/*" element={
        <MainLayout>
          <RemoteBoundary section={section}>
            <Routes>
              <Route path="/cart/*"    element={<ProtectedRoute><CartApp /></ProtectedRoute>} />
              <Route path="/orders/*"  element={<ProtectedRoute><OrdersApp /></ProtectedRoute>} />
              <Route path="/admin/*"   element={<ProtectedRoute roles={ADMIN_ROLES}><AdminApp /></ProtectedRoute>} />
              {/* El catálogo atiende `/` y `/products/:id`; lo demás es 404 */}
              <Route path="/*"         element={<CatalogApp notFound={<NotFoundPage />} />} />
            </Routes>
          </RemoteBoundary>
        </MainLayout>
      } />
    </Routes>
  );
}

export default AppRouter;
