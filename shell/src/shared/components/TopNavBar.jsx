import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthSession } from 'authApp/useAuth';
import { useCartBadge } from '../../core/events/useCartBadge';
import UserMenu from './UserMenu';

/**
 * Componente TopNavBar — Barra de navegación global del Shell.
 * Propósito: Mostrar la marca, búsqueda, contador del carrito y la sesión: botón de login o menú de usuario.
 * El contador del carrito es reactivo al eventBus. La búsqueda se publica en la URL (`/?q=...`) y la aplica
 * Catalog App.
 *
 * @returns {JSX.Element} Header sticky con navegación global
 * @sideeffects Suscribe al eventBus para actualizar el contador del carrito en tiempo real
 *   y escucha cambios de sesión (vía `useAuthSession`)
 */
function TopNavBar() {
  const { count } = useCartBadge()
  const { session, logout } = useAuthSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') ?? ''

  /**
   * Lleva la búsqueda al catálogo; vacía, vuelve al listado completo.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Envío del buscador
   * @returns {void}
   */
  function handleSearch(event) {
    event.preventDefault()
    const term = new FormData(event.currentTarget).get('q').trim()
    navigate(term ? `/?${new URLSearchParams({ q: term })}` : '/')
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-left">
            <div className="navbar-brand">
              <span className="navbar-brand-icon" aria-hidden="true">🛒</span>
              <h2 className="navbar-brand-title">E-commerce</h2>
            </div>
            <nav className="navbar-nav">
              <Link to="/" className="navbar-link-active">Home</Link>
            </nav>
          </div>
          <div className="navbar-actions">
            <form className="search-wrapper" role="search" onSubmit={handleSearch}>
              <div className="search-inner">
                <div className="search-icon-container">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  key={currentSearch}
                  type="search"
                  name="q"
                  className="search-input"
                  placeholder="Search products..."
                  aria-label="Buscar productos"
                  defaultValue={currentSearch}
                />
              </div>
            </form>
            <Link to="/cart" className="cart-btn" aria-label="Ver carrito">
              <span className="material-symbols-outlined">shopping_cart</span>
              {count > 0 && (
                <span className="cart-badge" aria-live="polite">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            {session.isAuthenticated ? (
              <UserMenu session={session} onLogout={logout} />
            ) : (
              <Link to="/login" className="navbar-login-btn">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;
