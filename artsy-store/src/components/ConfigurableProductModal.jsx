import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


export default function ConfigurableProductModal({ product, addToCart, onClose }) {
  const [config, setConfig] = useState(null);
  const [selectedSize, setSelectedSize] = useState("12x16");
  const [orientation, setOrientation] = useState("Vertical");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('settings').select('*').eq('key', 'space-painting-config').single()
      .then(({ data }) => {
        if (data && data.value) setConfig(data.value);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
        setLoading(false);
      });
  }, []);

  // Use config from state OR fallback to hardcoded defaults
  const activeConfig = config || {
    basePrice: 1250,
    customDesignPrice: 500,
    sizePrices: {
      "4x4": 70, "6x6": 90, "8x8": 110, "8x10": 130, "10x10": 140, "10x12": 150, 
      "12x12": 180, "12x16": 250, "12x18": 300, "16x20": 450, "18x24": 900, "24x36": 2000
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  if (loading) return null;

  const basePrice = product.price || activeConfig.basePrice;
  const sizePrice = activeConfig.sizePrices[selectedSize] || 0;
  const customPrice = isCustom ? activeConfig.customDesignPrice : 0;
  const totalPrice = basePrice + sizePrice + customPrice;

  const handleAddToCart = async () => {
    setIsUploading(true);
    let imageUrl = null;
    let requirements = "";

    if (isCustom) {
      const reqInput = document.getElementById('custom-requirements');
      const imgInput = document.getElementById('custom-image');
      requirements = reqInput?.value || "";

      if (imgInput?.files[0]) {
        const file = imgInput.files[0];
        try {
          const ext = file.name.split('.').pop();
          const path = `cart-refs/${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('orders').upload(path, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('orders').getPublicUrl(path);
          imageUrl = publicUrl;
        } catch (e) { console.error("Upload failed", e); }
      }
    }

    const item = {
      ...product,
      id: product.id + '-' + Date.now(), // Unique ID for cart
      name: `${product.name} (${selectedSize}, ${orientation}${isCustom ? ', Custom' : ''})`,
      price: totalPrice,
      customOptions: {
        size: selectedSize,
        orientation,
        isCustom,
        requirements
      }
    };
    addToCart(item);
    setIsUploading(false);
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2800,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)"}}/>
      <div className="modal-container responsive-modal" style={{
        position:"relative",
        background:"#fff",
        borderRadius:24,
        padding:"32px 24px",
        maxWidth:500,
        width:"100%",
        boxShadow:"0 32px 64px rgba(0,0,0,0.4)",
        maxHeight:"90vh",
        overflowY:"auto",
        display:"flex",
        flexDirection:"column"
      }}>
        <button onClick={onClose} style={{position:"absolute",top:15,right:15,background:"#f3f4f6",border:"none",width:32,height:32,borderRadius:"50%",fontSize:18,cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>✕</button>
        
        <div style={{textAlign:"center",marginBottom:24}}>
          <h3 style={{fontFamily:"var(--font-serif)",fontSize:24,color:"var(--color-jade)",marginBottom:4}}>{product.name}</h3>
          <p style={{color:"#6b7280",fontSize:13}}>Personalize your {product.tag.toLowerCase()} order</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          {/* Size Selection */}
          <div>
            <label style={{fontSize:11,fontWeight:800,color:"var(--color-jade)",letterSpacing:1,display:"block",marginBottom:12}}>SELECT CANVAS SIZE</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {Object.keys(activeConfig.sizePrices).map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding:"10px 4px",
                    borderRadius:8,
                    border:`2px solid ${selectedSize === size ? "var(--color-gold)" : "#eee"}`,
                    background: selectedSize === size ? "#fffbf0" : "#fff",
                    color: selectedSize === size ? "var(--color-jade)" : "#666",
                    fontSize:12,
                    fontWeight: selectedSize === size ? 700 : 500,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label style={{fontSize:11,fontWeight:800,color:"var(--color-jade)",letterSpacing:1,display:"block",marginBottom:12}}>ORIENTATION</label>
            <div style={{display:"flex",gap:12}}>
              {["Vertical", "Horizontal"].map(o => (
                <button 
                  key={o}
                  onClick={() => setOrientation(o)}
                  style={{
                    flex:1,
                    padding:"10px 4px",
                    borderRadius:8,
                    border:`2px solid ${orientation === o ? "var(--color-gold)" : "#eee"}`,
                    background: orientation === o ? "#fffbf0" : "#fff",
                    color: orientation === o ? "var(--color-jade)" : "#666",
                    fontSize:12,
                    fontWeight:600,
                    cursor:"pointer"
                  }}
                >
                  {o} {o === "Vertical" && "(Recommended)"}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Design Toggle */}
          <div style={{background:"#f9f8f4",padding:16,borderRadius:12,border:"1px solid #eee"}}>
            <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <input 
                type="checkbox" 
                checked={isCustom} 
                onChange={e => setIsCustom(e.target.checked)}
                style={{width:20,height:20,accentColor:"var(--color-jade)"}}
              />
              <div>
                <span style={{fontWeight:700,color:"var(--color-jade)"}}>Full Custom Design</span>
                <p style={{margin:0,fontSize:12,color:"#6b7280"}}>Add your own ideas to the design (+Rs. {activeConfig.customDesignPrice})</p>
              </div>
            </label>

            {isCustom && (
              <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:12,paddingTop:16,borderTop:"1px solid #eee"}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--color-jade)"}}>YOUR REQUIREMENTS</label>
                  <textarea 
                    id="custom-requirements"
                    placeholder="Describe your custom ideas (colors, characters, etc.)" 
                    rows={3}
                    style={{padding:12,borderRadius:8,border:"1.5px solid #eee",fontSize:14,resize:"none"}}
                  />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--color-jade)"}}>UPLOAD YOUR DESIGN PIC</label>
                  <input 
                    id="custom-image"
                    type="file" 
                    accept="image/*"
                    style={{fontSize:12}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price & Add Button */}
          <div style={{marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:12,color:"#6b7280"}}>Final Price:</span>
              <span style={{fontSize:24,fontWeight:800,color:"var(--color-jade)"}}>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={isUploading}
              style={{
                width:"100%",
                padding:"18px",
                borderRadius:12,
                background: isUploading ? "#9ca3af" : "var(--color-jade)",
                color:"var(--color-gold)",
                fontSize:16,
                fontWeight:800,
                border:"none",
                cursor: isUploading ? "not-allowed" : "pointer",
                boxShadow:"0 10px 20px rgba(17, 42, 34, 0.2)"
              }}
            >
              {isUploading ? "UPLOADING..." : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
