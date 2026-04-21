import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, addToCart, setInquire }) {
  const p = product;
  return (
    <div className="product-card card-hover">
      <div className="product-image-container">
        {p.video ? (
          <video 
            src={typeof p.video === 'string' && p.video.includes('localhost') ? p.video.replace(':5000', ':5055') : p.video} 
            muted 
            loop 
            playsInline 
            onMouseEnter={e=>e.currentTarget.play()} 
            onMouseLeave={e=>{e.currentTarget.pause(); e.currentTarget.currentTime=0;}}
            className="product-image"
          />
        ) : (
          <img src={typeof p.image === 'string' && p.image.includes('localhost') ? p.image.replace(':5000', ':5055') : p.image} alt={p.name} className="product-image" />
        )}
        {p.video && <div className="video-badge">🎥 Video</div>}
        <span className="tag-badge">{p.tag}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{p.name}</h3>
        <p className="product-price">Rs. {p.price.toLocaleString()}</p>
        <div className="product-actions">
          <button onClick={()=>addToCart(p)} className="btn-add-cart">
            Add to Cart
          </button>
          <button onClick={()=>setInquire(p)} className="btn-inquire">
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}
