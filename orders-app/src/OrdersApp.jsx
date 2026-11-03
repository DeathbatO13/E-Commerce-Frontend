import { Routes, Route } from 'react-router-dom';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentPage from './pages/PaymentPage';

/**
 * Componente OrdersApp — Microfrontend de Pedidos y Pagos.
 * Propósito: Checkout, pago simulado e historial de pedidos del usuario.
 * Expuesto vía Module Federation como: ordersApp/OrdersApp. El Shell la monta en `/orders/*`
 * y exige sesión (`ProtectedRoute`), así que las rutas de aquí son relativas a `/orders`.
 *
 * @returns {JSX.Element} Rutas de pedidos
 * @throws {None}
 * @sideeffects Ninguno
 */
function OrdersApp() {
  return (
    <div className="orders-app-shell">
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path=":id" element={<OrderDetailPage />} />
        <Route path=":id/pay" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default OrdersApp;
