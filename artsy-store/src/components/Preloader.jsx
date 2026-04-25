import React, { useState } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  const handleInteraction = () => {
    setFading(true);
    setTimeout(onFinish, 800); // Give time for fade animation
  };

  return (
    <div 
      className={`curtain-wrapper ${fading ? 'fade-out' : ''}`}
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
    >
      <div className="curtain-content">
        {/* 3 Hanging Strings & Items */}
        <div className="hanging-container">
          <div className="hanging-item item-1">
            <div className="string"></div>
            <div className="icon">🖌️</div>
          </div>
          <div className="hanging-item item-2">
            <div className="string"></div>
            <div className="icon">🎨</div>
          </div>
          <div className="hanging-item item-3">
            <div className="string"></div>
            <div className="icon">🖼️</div>
          </div>
        </div>

        <h1 className="curtain-logo">ARTSY DONUT</h1>
        <p className="curtain-hint">Move your mouse to enter</p>
      </div>
    </div>
  );
};

export default Preloader;
