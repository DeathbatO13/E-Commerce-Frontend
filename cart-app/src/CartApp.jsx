import { Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';

/**
 * Componente CartApp — Microfrontend del Carrito de Compras.
 * Propósito: Gestionar y visualizar los ítems agregados al carrito temporal del usuario.
 * Expuesto vía Module Federation como: cartApp/CartApp
 * 
 * @returns {JSX.Element} Rutas del carrito
 */
function CartApp() {
  return (
    <div className="cart-app-shell">
      <Routes>
        <Route path="/" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default CartApp;
