import React from 'react';
import './Navbar.css';

export default function Navbar({ logo, cartCount, setCartOpen, setView, setCustomModalOpen }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img src={logo} alt="logo" style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-gold)', marginRight: 10}} />
          <span className="logo-text">artsy.donut</span>
        </div>

        <div className="navbar-links">
          <a href="#shop" className="nav-link">SHOP</a>
          <button onClick={() => setCustomModalOpen(true)} className="nav-link" style={{background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit'}}>CUSTOM ORDERS</button>
          <a href="#about" className="nav-link">ABOUT</a>
          <a href="#contact" className="nav-link">CONTACT</a>
          
          <div className="cart-trigger" onClick={() => setCartOpen(true)}>
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
