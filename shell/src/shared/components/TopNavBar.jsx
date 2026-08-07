import React from 'react';
import { Link } from 'react-router-dom';
import { useCartBadge } from '../../core/events/useCartBadge';

/**
 * Componente TopNavBar — Barra de navegación global del Shell.
 * Propósito: Mostrar la marca, navegación principal, búsqueda, contador del carrito
 * y avatar del usuario. El contador del carrito es reactivo al eventBus.
 *
 * @returns {JSX.Element} Header sticky con navegación global
 * @sideeffects Suscribe al eventBus para actualizar el contador del carrito en tiempo real
 */
function TopNavBar() {
  const { count } = useCartBadge()

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
              <Link to="/categories" className="navbar-link">Categories</Link>
              <Link to="/about" className="navbar-link">About Us</Link>
            </nav>
          </div>
          <div className="navbar-actions">
            <label className="search-wrapper">
              <div className="search-inner">
                <div className="search-icon-container">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                />
              </div>
            </label>
            <Link to="/cart" className="cart-btn" aria-label="Ver carrito">
              <span className="material-symbols-outlined">shopping_cart</span>
              {count > 0 && (
                <span className="cart-badge" aria-live="polite">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <div className="user-avatar" data-alt="User profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRJhcTu9q0kgoSqzKclLZ_nujdAPFTWLBJvNZ6tqjaeQX4xEPxlWD0opjssm2MHa5IdJltfK9McXttxOIQBHrtTX9trVUl-yChcmyHWuIAPp4H_kRE1czJtWOkSA6oXKPT7p2j9c3caVt6s5iTWbbIretLi6q5JgDin77VJJNB5OAOX0PAR07JbFa7qXSWlz4HdH1Lra2gZIwQjVNAPzD5pqVklKmAO-hW2-tUX4vlxgMd85cQ4AIr06sPbtZ-4U1XcmgqFhqy5-dc")' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;

