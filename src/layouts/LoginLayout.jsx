import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function LoginLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const toggleTab = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark overflow-x-hidden p-4 md:p-6 lg:p-8 ${
        isDarkMode ? "dark" : ""
      }`}
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 lg:grid lg:grid-cols-2">
        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex flex-col justify-between bg-primary p-8 text-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">storefront</span>
              <h2 className="text-xl font-bold">E-commerce</h2>
            </div>
          </div>

          <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">
                {isLoginPage ? "Bienvenido de nuevo" : "Únete a nuestra comunidad"}
              </h3>
              <p className="text-white/80">
                {isLoginPage
                  ? "Tu tienda de confianza para encontrar los mejores productos. Inicia sesión para continuar."
                  : "Crea tu cuenta y disfruta de una experiencia de compra sin límites con los mejores productos."}
              </p>
          </div>

          <div className="text-xs text-white/60">
            © 2024 E-commerce. Todos los derechos reservados.
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="flex flex-col p-8 sm:p-12">
          {/* Tab Toggle */}
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-background-dark p-1 mb-8">
            <label
              onClick={() => toggleTab("/login")}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${
                isLoginPage
                  ? "bg-white dark:bg-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              } text-sm font-medium leading-normal`}
            >
              <span className="truncate">Iniciar Sesión</span>
            </label>
            <label
              onClick={() => toggleTab("/login/register")}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${
                !isLoginPage
                  ? "bg-white dark:bg-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              } text-sm font-medium leading-normal`}
            >
              <span className="truncate">Registrarse</span>
            </label>
          </div>

          {/* Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
