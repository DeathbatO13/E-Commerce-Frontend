import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginLayout from "@/layouts/LoginLayout";
import RequireAuth from "./RequireAuth";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/layouts/MainLayout";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RecoverPassword from "@/pages/RecoverPassword";

import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "recover", element: <RecoverPassword /> },
    ],
  },

  // Main site layout visible for public pages (header/navigation is here)
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductListPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },

      // Protected routes: require auth
      {
        element: (
          <RequireAuth>
            <></>
          </RequireAuth>
        ),
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
