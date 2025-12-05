import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 w-full border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-text-light dark:text-text-dark">
                <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
                <span className="text-lg font-bold">E-Commerce</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-subtext-light dark:text-subtext-dark hover:text-primary"}`}>Home</NavLink>
                <NavLink to="/products" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-subtext-light dark:text-subtext-dark hover:text-primary"}`}>Productos</NavLink>
                <NavLink to="/orders" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-subtext-light dark:text-subtext-dark hover:text-primary"}`}>Pedidos</NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center rounded-lg bg-background-light dark:bg-background-dark px-2 py-1">
                <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark">search</span>
                <input className="ml-2 bg-transparent focus:outline-none text-sm" placeholder="Buscar productos..." />
              </div>

              <Link to="/cart" className="relative flex items-center justify-center rounded-full h-10 w-10 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-primary/10">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span>
              </Link>

              <div className="relative">
                <button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 rounded-full p-1 hover:bg-background-light dark:hover:bg-background-dark">
                  <div className="h-9 w-9 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBRJhcTu9q0kgoSqzKclLZ_nujdAPFTWLBJvNZ6tqjaeQX4xEPxlWD0opjssm2MHa5IdJltfK9McXttxOIQBHrtTX9trVUl-yChcmyHWuIAPp4H_kRE1czJtWOkSA6oXKPT7p2j9c3caVt6s5iTWbbIretLi6sP)'}} />
                  <span className="hidden sm:block text-sm font-medium text-text-light dark:text-text-dark">{user?.email ?? "Cuenta"}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 shadow-lg py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-slate-700">Perfil</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-slate-700">Cerrar sesión</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="w-full border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-subtext-light dark:text-subtext-dark">
          © 2025 ReactStore. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
