import React from 'react';
import './Hero.css';

export default function Hero({ img4000, allProductsCount, setCustomModalOpen }) {
  return (
    <header className="hero" style={{ backgroundImage: `linear-gradient(rgba(17, 42, 34, 0.8), rgba(17, 42, 34, 0.8)), url(${img4000})` }}>
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <p className="hero-tagline animate-fade-up">ORIGINAL HANDCRAFTED ART</p>

      <div className="hero-insta-box animate-fade-up">
        <a href="https://www.instagram.com/_.artsy.donut._/" target="_blank" rel="noreferrer" className="hero-insta-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <p style={{ color: "var(--color-gold)", fontSize: 12, fontWeight: 700, marginTop: 8, letterSpacing: 1 }}>@_.artsy.donut._</p>

        <h2 className="hero-slogan" style={{ fontFamily: "var(--font-serif)", color: "var(--color-gold)", fontSize: "clamp(20px, 4vw, 32px)", marginTop: "16px", fontWeight: 800, letterSpacing: "2px" }}>
          ART THAT SPEAKS <br /> WITHOUT WORDS
        </h2>
      </div>

      <h1 className="hero-title animate-fade-up-d1 shimmer-text">
        ARTSY.DONUT
      </h1>
      <p className="hero-subtitle animate-fade-up-d2">
        Authentic Handpainted Calligraphy & Portraits.
      </p>
      <div className="hero-actions animate-fade-up-d2">
        <a href="#shop" className="btn-primary">EXPLORE COLLECTION</a>
        <button onClick={() => setCustomModalOpen(true)} className="btn-outline">CUSTOM DESIGN</button>
      </div>
    </header>
  );
}
