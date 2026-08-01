import React from 'react'
import TopNavBar from '../../shared/components/TopNavBar';
import Footer from '../../shared/components/Footer';

/**
 * Componente MainLayout — Layout global del Shell.
 * Propósito: Estructurar la interfaz general (Header, Main Content, Footer) para todos los microfrontends excepto Auth.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - El contenido principal a renderizar en la sección central
 * @returns {JSX.Element} Interfaz global de la aplicación
 * @throws {None}
 * @sideeffects Ninguno
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

    </div>
  );
}

export default MainLayout;
