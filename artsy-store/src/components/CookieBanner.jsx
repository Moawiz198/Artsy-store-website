import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (accepted === null) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    // If they decline, we don't save the state, so it will show again next time
    // and we clear any saved order ID because they don't want tracking cookies
    localStorage.removeItem('lastOrderId');
    localStorage.setItem('cookieAccepted', 'false');
    setShow(false);
    alert("Note: Your order tracking history will not be saved for your next visit.");
  };

  if (!show) return null;

  return (
    <div id="cookieBanner" style={{
      position: "fixed",
      bottom: 24,
      left: 24,
      right: 24,
      background: "#fff",
      padding: "24px 32px",
      borderRadius: 20,
      boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
      zIndex: 10000,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 600,
      margin: "0 auto",
      border: "2px solid var(--color-jade)",
      animation: "slideUp 0.5s ease-out"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 15 }}>
        <span style={{ fontSize: 32 }}>🍪</span>
        <div>
          <h4 style={{ margin: "0 0 8px", color: "var(--color-jade)", fontFamily: "var(--font-serif)", fontSize: 18 }}>We Value Your Privacy</h4>
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
            We use cookies to save your cart and track your order status (Paid/Pending). 
            <strong> Note:</strong> If you do not accept cookies, your <strong>order tracking history will be cleared</strong> when you close or refresh the website.
          </p>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button 
          onClick={handleDecline} 
          style={{ background: "#f3f4f6", color: "#4b5563", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
        >
          Decline
        </button>
        <button 
          onClick={handleAccept} 
          style={{ background: "var(--color-jade)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 13, boxShadow: "0 4px 12px rgba(17, 42, 34, 0.2)" }}
        >
          Accept Cookies
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
