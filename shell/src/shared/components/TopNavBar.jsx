import React from 'react';
import { Link } from 'react-router-dom';

function TopNavBar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-left">
            <div className="navbar-brand">
              <span className="material-symbols-outlined navbar-brand-icon">storefront</span>
              <h2 className="navbar-brand-title">ReactStore</h2>
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
            <button className="cart-btn">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="cart-badge">3</span>
            </button>
            <div className="user-avatar" data-alt="User profile picture" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRJhcTu9q0kgoSqzKclLZ_nujdAPFTWLBJvNZ6tqjaeQX4xEPxlWD0opjssm2MHa5IdJltfK9McXttxOIQBHrtTX9trVUl-yChcmyHWuIAPp4H_kRE1czJtWOkSA6oXKPT7p2j9c3caVt6s5iTWbbIretLi6q5JgDin77VJJNB5OAOX0PAR07JbFa7qXSWlz4HdH1Lra2gZIwQjVNAPzD5pqVklKmAO-hW2-tUX4vlxgMd85cQ4AIr06sPbtZ-4U1XcmgqFhqy5-dc")' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;
