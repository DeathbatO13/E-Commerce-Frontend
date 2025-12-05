import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginLayout from "@/layouts/LoginLayout";
import RequireAuth from "./RequireAuth";
import PublicRoute from "./PublicRoute";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RecoverPassword from "@/pages/RecoverPassword";

import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
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
  {
    element: <RequireAuth />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductListPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
      { path: "/cart", element: <CartPage /> },
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
