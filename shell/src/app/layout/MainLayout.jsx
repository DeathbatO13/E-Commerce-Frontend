import React, { Suspense, lazy } from 'react'
import TopNavBar from '../../shared/components/TopNavBar';
import Footer from '../../shared/components/Footer';
import RemoteErrorBoundary from '../components/RemoteErrorBoundary';

// Sincroniza el carrito con el backend desde cualquier página (escucha CART_ADD_ITEM y publica CART_UPDATED)
const CartSync = lazy(() => import('cartApp/CartSync'));

/**
 * Componente MainLayout — Layout global del Shell.
 * Propósito: Estructurar la interfaz general (Header, Main Content, Footer) para todos los microfrontends excepto Auth.
 * También monta `CartSync` de Cart App; si ese remoto no carga, el resto del layout sigue funcionando.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - El contenido principal a renderizar en la sección central
 * @returns {JSX.Element} Interfaz global de la aplicación
 * @throws {None}
 * @sideeffects Carga el remoto `cartApp/CartSync`
 */
function MainLayout({ children }) {
  return (
    <div className="layout-wrapper">

      {/* Navbar */}
      <TopNavBar />

      {/* Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sincronización del carrito (sin UI salvo avisos de error) */}
      <RemoteErrorBoundary>
        <Suspense fallback={null}>
          <CartSync />
        </Suspense>
      </RemoteErrorBoundary>

    </div>
  );
}

export default MainLayout;
