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
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: isHovered ? "24px 32px" : "15px",
        borderRadius: isHovered ? 24 : 50,
        boxShadow: isHovered ? "0 25px 50px rgba(0,0,0,0.2)" : "0 10px 25px rgba(16, 185, 129, 0.2)",
        border: "1.5px solid rgba(16, 185, 129, 0.2)",
        maxWidth: isHovered ? 500 : 60,
        transition: "all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: isHovered ? "default" : "pointer",
        animation: "entrance 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), float 4s ease-in-out infinite"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 15, minWidth: isHovered ? "auto" : 30 }}>
        <div style={{ 
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {!isHovered && <div className="cookie-pulse"></div>}
          <span style={{ 
            fontSize: isHovered ? 32 : 24, 
            transition: "0.4s",
            transform: isHovered ? "rotate(15deg) scale(1.1)" : "rotate(0deg)"
          }}>
            🍪
          </span>
        </div>
        {isHovered && (
          <div style={{ animation: "slideInText 0.5s ease-out forwards" }}>
            <h4 style={{ margin: "0 0 4px", color: "var(--color-jade)", fontFamily: "var(--font-serif)", fontSize: 18, letterSpacing: 0.5 }}>Cookie Settings</h4>
            <p style={{ margin: 0, fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>
              We use cookies to save your cart and track your orders. 
              <strong> Note: History is lost if declined.</strong>
            </p>
          </div>
        )}
      </div>
      
      {isHovered && (
        <div style={{ 
          display: "flex", 
          gap: 10, 
          justifyContent: "flex-end",
          animation: "fadeIn 0.8s ease-out forwards"
        }}>
          <button 
            onClick={handleDecline} 
            style={{ background: "transparent", color: "#666", border: "1px solid #ddd", borderRadius: 10, padding: "8px 16px", fontWeight: 600, cursor: "pointer", fontSize: 11, transition: "0.2s" }}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept} 
            style={{ background: "var(--color-jade)", color: "var(--color-gold)", border: "none", borderRadius: 10, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}
          >
            Accept Cookies
          </button>
        </div>
      )}

      <style>{`
        @keyframes entrance {
          0% { transform: translateX(-150px) rotate(-45deg); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        @keyframes slideInText {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .cookie-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--color-jade);
          border-radius: 50%;
          opacity: 0.5;
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          80%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
