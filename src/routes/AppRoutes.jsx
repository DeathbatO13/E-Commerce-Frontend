import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginLayout from "@/layouts/LoginLayout";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RecoverPassword from "@/pages/RecoverPassword";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "recover", element: <RecoverPassword /> }
    ],
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductListPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
