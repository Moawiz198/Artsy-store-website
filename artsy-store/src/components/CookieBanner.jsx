import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (accepted === null) {
      // Small delay for entrance animation
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.removeItem('lastOrderId');
    localStorage.setItem('cookieAccepted', 'false');
    setShow(false);
    alert("Note: Your order tracking history will not be saved.");
  };

  if (!show) return null;

  return (
    <div 
      id="cookieBanner" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        bottom: 30,
        left: 30,
        zIndex: 10000,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: isHovered ? "24px 32px" : "15px",
        borderRadius: isHovered ? 24 : 50,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        border: "1.5px solid rgba(17, 42, 34, 0.1)",
        maxWidth: isHovered ? 500 : 60,
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: isHovered ? "default" : "pointer",
        animation: "float 4s ease-in-out infinite"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 15, minWidth: isHovered ? "auto" : 30 }}>
        <span style={{ 
          fontSize: isHovered ? 32 : 24, 
          transition: "0.4s",
          transform: isHovered ? "rotate(10deg)" : "rotate(0deg)"
        }}>
          🍪
        </span>
        {isHovered && (
          <div style={{ animation: "fadeIn 0.4s ease-out forwards" }}>
            <h4 style={{ margin: "0 0 4px", color: "var(--color-jade)", fontFamily: "var(--font-serif)", fontSize: 18 }}>Cookie Settings</h4>
            <p style={{ margin: 0, fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>
              We use cookies to save your cart and track your orders. 
              <strong> If declined, history will be lost.</strong>
            </p>
          </div>
        )}
      </div>
      
      {isHovered && (
        <div style={{ 
          display: "flex", 
          gap: 10, 
          justifyContent: "flex-end",
          animation: "fadeIn 0.6s ease-out forwards"
        }}>
          <button 
            onClick={handleDecline} 
            style={{ background: "transparent", color: "#666", border: "1px solid #eee", borderRadius: 10, padding: "8px 16px", fontWeight: 600, cursor: "pointer", fontSize: 11 }}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept} 
            style={{ background: "var(--color-jade)", color: "var(--color-gold)", border: "none", borderRadius: 10, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}
          >
            Accept Cookies
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
