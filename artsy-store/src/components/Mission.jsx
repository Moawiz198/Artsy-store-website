import React from 'react';
import './Mission.css';

export default function Mission() {
  return (
    <section id="about" className="mission">
      <div className="mission-container">
        <p className="mission-tagline">OUR PURPOSE & PASSION</p>
        <h2 className="mission-title">The Goal of Artsy Donut</h2>
        
        <div className="mission-grid">
          <div className="mission-item">
            <span className="mission-icon">✨</span>
            <h3 className="mission-item-title">Preserving Tradition</h3>
            <p className="mission-item-text">
              Our goal is to keep the beautiful art of Arabic Calligraphy alive in modern homes, blending age-old scripts with contemporary design.
            </p>
          </div>
          
          <div className="mission-item">
            <span className="mission-icon">🤝</span>
            <h3 className="mission-item-title">Personal Connection</h3>
            <p className="mission-item-text">
              Every piece is a conversation. We aim to create art that resonates personally with you, whether it's a favorite Surah or a family portrait.
            </p>
          </div>
          
          <div className="mission-item">
            <span className="mission-icon">🌿</span>
            <h3 className="mission-item-title">Sustainable Craft</h3>
            <p className="mission-item-text">
              We focus on 100% handcrafted production, ensuring that each artwork is unique, durable, and made with the highest quality local materials.
            </p>
          </div>
          
          <div className="mission-item">
            <span className="mission-icon">🚀</span>
            <h3 className="mission-item-title">Future Goals</h3>
            <p className="mission-item-text">
              We are expanding to include more art forms, including Crochet and Digital Portraits, while keeping our commitment to quality and soul.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
