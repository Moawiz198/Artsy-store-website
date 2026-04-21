import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import Mission from './components/Mission';
import Contact from './components/Contact';

// Assets
import logo    from './assets/logo.jpg';
import img1500 from './assets/1500.jpg';
import img1400 from './assets/1400.jpg';
import img4000 from './assets/4000.jpg';
import img2000a from './assets/2000jpg.jpg';
import img1800 from './assets/1800jpg.jpg';
import img6000 from './assets/6000.jpg';
import img2500 from './assets/2500.jpg';
import img1000 from './assets/1000jpg.jpg';
import img2000b from './assets/2000.jpg';

function CustomOrderModal({ setCustomModalOpen }) {
  const [category, setCategory] = React.useState('Art'); // 'Art' or 'Crochet'

  return (
    <div style={{position:"fixed",inset:0,zIndex:110,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={()=>setCustomModalOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
          <button onClick={()=>setCustomModalOpen(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer"}}>✕</button>
          <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,color:"var(--color-jade)",marginBottom:12,textAlign:"center"}}>Custom Order Request</h3>
          <p style={{textAlign:"center",color:"#6b7280",marginBottom:24,fontSize:14}}>Choose your category and tell us what you'd like us to create.</p>
          
          <div style={{display:"flex",gap:10,marginBottom:16,justifyContent:"center"}}>
            <button 
              type="button"
              onClick={()=>setCategory('Art')} 
              className={`category-toggle-btn ${category==='Art'?'active':''}`}
              style={{flex:1}}
            >
              🎨 Art / Calligraphy
            </button>
            <button 
              type="button"
              onClick={()=>setCategory('Crochet')} 
              className={`category-toggle-btn ${category==='Crochet'?'active':''}`}
              style={{flex:1}}
            >
              🧶 Crochet
            </button>
          </div>

          <div style={{background:"#f0fdf4", border:"1px solid #dcfce7", padding:"12px 16px", borderRadius:10, marginBottom:24, textAlign:"center"}}>
            <p style={{margin:0, color:"#166534", fontSize:13, fontWeight:600}}>
              ✨ We will contact you within 4 hours on Instagram DM.
            </p>
            <p style={{margin:"4px 0 0", color:"#166534", fontSize:12}}>
              For quick information, DM us on <a href="https://ig.me/m/_.artsy.donut._" target="_blank" rel="noreferrer" style={{color:"var(--color-jade)", fontWeight:700, textDecoration:"underline"}}>Instagram</a>.
            </p>
          </div>

          <form onSubmit={async (e)=>{
            e.preventDefault();
            const data = new FormData(e.target);
            const formData = { 
              name: data.get('name'), 
              whatsapp: data.get('whatsapp'), 
              surah: category === 'Art' ? data.get('surah') : 'Crochet Request', 
              size: category === 'Art' ? data.get('size') : 'Custom', 
              colors: category === 'Crochet' ? data.get('colors') : 'N/A',
              requirements: data.get('requirements') 
            };
            try {
              const res = await fetch('http://localhost:5055/api/custom-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
              if (res.ok) { 
                alert("Request sent successfully!"); 
                setCustomModalOpen(false); 
              } else {
                const errData = await res.json();
                alert(errData.error || "Failed to send request.");
              }
            } catch (e) { alert("Error connecting to server. Please check if the backend is running."); }
          }} style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:11,fontWeight:700,color:"#666"}}>YOUR NAME</label>
                <input 
                  name="name" 
                  placeholder="Ahmad Hassan" 
                  required 
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                  style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15}}
                />
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:11,fontWeight:700,color:"#666"}}>INSTAGRAM USERNAME / NUMBER</label>
                <input 
                  name="whatsapp" 
                  type="text" 
                  placeholder="@your_id or Phone" 
                  required 
                  style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15}}
                />
              </div>
            </div>

            {category === 'Art' ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#666"}}>SURAH / TEXT</label>
                  <input name="surah" placeholder="e.g. Ayat-ul-Kursi" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#666"}}>CANVAS SIZE</label>
                  <input name="size" placeholder="e.g. 12x12 inches" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15}}/>
                </div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:11,fontWeight:700,color:"#666"}}>COLOR PREFERENCE</label>
                <input name="colors" placeholder="e.g. Red, Multi-colors, Pastel blue..." required style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15}}/>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>ADDITIONAL REQUIREMENTS</label>
              <textarea name="requirements" placeholder="Tell us more about your vision..." rows={4} required style={{padding:14,borderRadius:10,border:"1.5px solid #eee",fontSize:15,resize:"none"}}/>
            </div>

            <button type="submit" style={{padding:16,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:800,borderRadius:10,border:"none",fontSize:16,cursor:"pointer",marginTop:8,boxShadow:"0 10px 20px rgba(17, 42, 34, 0.2)"}}>
              SEND CUSTOM REQUEST
            </button>
          </form>
      </div>
    </div>
  );
}

const initialProducts = [
  { id:1, name:"Saturn Cloud Head",            price:1500, image:img1500, tag:"Painting"     },
  { id:2, name:"Abstract Couple Portrait",      price:1400, image:img1400, tag:"Portrait"     },
  { id:3, name:"Golden Arabic Calligraphy",     price:4000, image:img4000, tag:"Calligraphy"  },
  { id:4, name:"Silver Brick Wall Calligraphy", price:2000, image:img2000a,tag:"Calligraphy"  },
  { id:5, name:"Pastel Calligraphy Canvas",     price:1800, image:img1800, tag:"Canvas"       },
  { id:6, name:"Bows & Bismillah Calligraphy",  price:6000, image:img6000, tag:"Calligraphy"  },
  { id:7, name:"Textured Rabzi Zidni Ilma",     price:2500, image:img2500, tag:"Textured"     },
  { id:8, name:"Kaaba Calligraphy",             price:1000, image:img1000, tag:"Calligraphy"  },
  { id:9, name:"Black & Gold Qul Calligraphy",  price:2000, image:img2000b,tag:"Calligraphy"  },
];

export default function ArtStore() {
  const [view, setView]           = useState('customer');
  const [loading, setLoading]     = useState(true);
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [inquire, setInquire]     = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen]     = useState(false);
  const [orders, setOrders]                 = useState([]);
  const [requests, setRequests]             = useState([]);
  const [dbProducts, setDbProducts]         = useState([]);
  const [adminAuth, setAdminAuth]           = useState(false);
  const [passInput, setPassInput]           = useState("");

  useEffect(() => {
    const hideLoader = () => setLoading(false);
    
    // Auto-hide after 1.5 seconds anyway
    const timer = setTimeout(hideLoader, 1500);
    
    // Hide immediately on user interaction
    window.addEventListener('scroll', hideLoader, { once: true });
    window.addEventListener('mousemove', hideLoader, { once: true });
    window.addEventListener('touchstart', hideLoader, { once: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', hideLoader);
      window.removeEventListener('mousemove', hideLoader);
      window.removeEventListener('touchstart', hideLoader);
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:5055/api/products').then(r => r.json()).then(setDbProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (view === 'admin' && adminAuth) {
      fetch('http://localhost:5055/api/orders').then(r => r.json()).then(setOrders).catch(console.error);
      fetch('http://localhost:5055/api/custom-requests').then(r => r.json()).then(setRequests).catch(console.error);
    }
  }, [view, adminAuth]);

  const addToCart = (p) => setCart(c => [...c, p]);
  const removeFromCart = (i) => setCart(c => c.filter((_,idx)=>idx!==i));
  const total = cart.reduce((s,i)=>s+i.price,0);
  const advance = Math.round(total * 0.70);

  const allProducts = [...initialProducts, ...dbProducts];
  const tags = ['All', ...new Set(allProducts.map(p => p.tag)), 'Crochet'];
  const visible = activeTag === 'All' ? allProducts : allProducts.filter(p => p.tag === activeTag);


  if (view === 'admin') {
    if (!adminAuth) {
      return (
        <div style={{height:"100vh",background:"#0a1a14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",padding:24}}>
          <div className="modal-container" style={{background:"#fff",padding:40,borderRadius:20,width:"100%",maxWidth:400,textAlign:"center",boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}}>
            <h2 style={{fontFamily:"var(--font-serif)",fontSize:28,color:"var(--color-jade)",marginBottom:12}}>Admin Access</h2>
            <p style={{color:"#666",fontSize:14,marginBottom:24}}>Please enter the owner password.</p>
            <form onSubmit={(e)=>{
              e.preventDefault();
              if(passInput === import.meta.env.VITE_ADMIN_PASSWORD) setAdminAuth(true);
              else alert("Incorrect password!");
            }}>
              <input type="password" placeholder="Password" autoFocus value={passInput} onChange={e=>setPassInput(e.target.value)} style={{width:"100%",padding:14,borderRadius:10,border:"1.5px solid #eee",marginBottom:20,textAlign:"center",fontSize:16}}/>
              <button type="submit" style={{width:"100%",padding:14,borderRadius:10,background:"var(--color-jade)",color:"var(--color-gold)",border:"none",fontWeight:700,cursor:"pointer"}}>LOGIN</button>
              <button onClick={()=>setView('welcome')} style={{marginTop:16,background:"none",border:"none",color:"#999",fontSize:13,cursor:"pointer"}}>Cancel</button>
            </form>
          </div>
        </div>
      );
    }
    return <AdminDashboard orders={orders} setOrders={setOrders} requests={requests} setRequests={setRequests} dbProducts={dbProducts} setDbProducts={setDbProducts} setAdminAuth={setAdminAuth} setView={setView} />;
  }

  return (
    <div style={{fontFamily:"var(--font-sans)",background:"var(--color-cream)",minHeight:"100vh"}}>
      
      {loading && (
        <div className="preloader-overlay">
          <div className="hanging-container">
            <div className="hanging-item" style={{animationDelay:"0.1s"}}><div className="hanging-string"></div><div className="hanging-icon">🖌️</div></div>
            <div className="hanging-item" style={{animationDelay:"0.3s"}}><div className="hanging-string"></div><div className="hanging-icon">🎨</div></div>
            <div className="hanging-item" style={{animationDelay:"0.5s"}}><div className="hanging-string"></div><div className="hanging-icon">🖼️</div></div>
          </div>
          <div className="preloader-text">ARTSY DONUT</div>
        </div>
      )}

      <Navbar logo={logo} cartCount={cart.length} setCartOpen={setCartOpen} setView={setView} setCustomModalOpen={setCustomModalOpen} />
      
      <Hero img4000={img4000} allProductsCount={allProducts.length} setCustomModalOpen={setCustomModalOpen} />
      
      <Mission />

      <section id="shop" style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <p style={{color:"var(--color-gold)",letterSpacing:4,fontSize:12,marginBottom:12}}>CURATED COLLECTION</p>
          <h2 style={{fontFamily:"var(--font-serif)",fontSize:44,fontWeight:700,color:"var(--color-jade)",margin:"0 auto 8px"}}>Featured Artworks</h2>
          <p style={{color:"#6b7280",maxWidth:460,margin:"0 auto"}}>Every piece is an original — signed, dated, and ready to ship.</p>
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
          {tags.map(t=>(
            <button key={t} onClick={()=>setActiveTag(t)} style={{padding:"8px 22px",borderRadius:50,border:`1.5px solid ${activeTag===t?"var(--color-gold)":"#d1c9b8"}`,background:activeTag===t?"var(--color-gold)":"transparent",color:activeTag===t?"var(--color-jade)":"#6b7280",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>
              {t}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="shop-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:32}}>
            {visible.map(p=>(
              <ProductCard key={p.id || p._id} product={p} addToCart={addToCart} setInquire={setInquire} />
            ))}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"80px 24px",background:"#fff",borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:48,marginBottom:20}}>🧶</div>
            <h3 style={{fontFamily:"var(--font-serif)",fontSize:28,fontWeight:700,color:"var(--color-jade)",marginBottom:12}}>{activeTag} Collection Coming Soon</h3>
            <p style={{color:"#6b7280",maxWidth:400,margin:"0 auto 32px"}}>We are currently crafting beautiful handmade {activeTag.toLowerCase()} pieces. Stay tuned for our next drop!</p>
            <button onClick={()=>setCustomModalOpen(true)} style={{background:"var(--color-gold)",color:"var(--color-jade)",border:"none",borderRadius:8,padding:"12px 32px",fontWeight:700,fontSize:14,cursor:"pointer"}}>
              REQUEST CUSTOM {activeTag.toUpperCase()}
            </button>
          </div>
        )}
      </section>

      <Contact />

      <footer style={{background:"#0a1f14",color:"#6b7a63",textAlign:"center",padding:"32px 24px"}}>
        <p style={{fontFamily:"var(--font-serif)",fontSize:22,color:"var(--color-gold)",marginBottom:8}}>artsy.donut</p>
        <p style={{fontSize:13,letterSpacing:1}}>© {new Date().getFullYear()} artsy.donut Calligraphy · All rights reserved.</p>
        <button onClick={()=>setView('admin')} style={{marginTop:20,background:"transparent",border:"1px solid #1a3a2a",color:"#3a4a3a",fontSize:11,padding:"4px 10px",borderRadius:4,cursor:"pointer"}}>Admin Portal</button>
      </footer>

      {cartOpen && <CartDrawer cart={cart} setCartOpen={setCartOpen} removeFromCart={removeFromCart} setCheckoutOpen={setCheckoutOpen} total={total} advance={advance} />}

      {/* Inquire & Custom Modal Logic stays in App.jsx for simplicity or can be moved later */}
      {/* (I'll keep the modal code here but it is much cleaner now) */}
      {checkoutOpen && (
        <div style={{position:"fixed",inset:0,zIndex:110,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={()=>setCheckoutOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
          <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
            <button onClick={()=>setCheckoutOpen(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#6b7280"}}>✕</button>
            <div style={{textAlign:"center",marginBottom:32}}>
              <p style={{color:"var(--color-gold)",letterSpacing:4,fontSize:11,fontWeight:700,marginBottom:8}}>SECURE CHECKOUT</p>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,fontWeight:700,color:"var(--color-jade)",margin:0}}>Complete Your Order</h3>
            </div>
            <div style={{background:"#f9f8f4",borderRadius:12,padding:20,marginBottom:28,border:"1px solid #eee"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#666"}}>Total:</span><span style={{fontWeight:700,color:"var(--color-jade)"}}>Rs. {total.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:"1px dashed #ddd"}}><span style={{fontWeight:700}}>Advance (70%):</span><span style={{fontWeight:800,color:"#c9a84c",fontSize:20}}>Rs. {advance.toLocaleString()}</span></div>
            </div>
            <div style={{background:"var(--color-jade)",color:"#fff",padding:20,borderRadius:12,marginBottom:32}}>
              <p style={{fontSize:18,fontWeight:700,margin:0}}>JazzCash: {import.meta.env.VITE_JAZZCASH_NUMBER || "+92 300 0000000"}</p>
              <p style={{fontSize:15,opacity:0.9,margin:0}}>Name: {import.meta.env.VITE_OWNER_NAME || "Artsy Owner"}</p>
            </div>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const form = e.target;
              if(!form.querySelector('input[type="checkbox"]').checked) return alert("Please confirm advance payment");
              const data = new FormData(form);
              const formData = {
                customerName: data.get('customerName'),
                whatsapp: data.get('whatsapp'),
                address: data.get('address'),
                paymentMethod: "70% Advance Paid",
                items: cart,
                totalAmount: total,
                advanceAmount: advance
              };
              try {
                const res = await fetch('http://localhost:5055/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
                if(res.ok) { 
                  alert("Order Received!"); 
                  setCart([]); 
                  setCheckoutOpen(false); 
                } else {
                  const errData = await res.json();
                  alert(errData.error || "Failed to place order.");
                }
              } catch (e) { alert("Error connecting to server. Please check if the backend is running."); }
            }} style={{display:"flex",flexDirection:"column",gap:16}}>
              <input name="customerName" type="text" placeholder="Full Name" required onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')} style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
              <input name="whatsapp" type="text" placeholder="Instagram Username or Contact Number" required style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
              <textarea name="address" placeholder="Shipping Address (Full Details)" rows={3} required style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
              <label style={{display:"flex",gap:12,alignItems:"center",cursor:"pointer"}}><input type="checkbox" required /> I have paid the 70% advance.</label>
              <button type="submit" style={{width:"100%",padding:"15px",borderRadius:8,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:700}}>CONFIRM ORDER</button>
            </form>
          </div>
        </div>
      )}

      {customModalOpen && (
        <CustomOrderModal onClose={() => setCustomModalOpen(true)} setCustomModalOpen={setCustomModalOpen} />
      )}

      {inquire && (
        <div style={{position:"fixed",inset:0,zIndex:110,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={()=>setInquire(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
          <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)"}}>
             <button onClick={()=>setInquire(null)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer"}}>✕</button>
             <div style={{textAlign:"center",marginBottom:24}}>
               <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,color:"var(--color-jade)",margin:"0 0 8px"}}>Inquire About Item</h3>
               <p style={{color:"var(--color-gold)",fontWeight:600}}>{inquire.name} — Rs. {inquire.price.toLocaleString()}</p>
             </div>
             <form onSubmit={async (e)=>{
               e.preventDefault();
               const data = new FormData(e.target);
               const formData = { 
                 name: data.get('name'), 
                 whatsapp: data.get('whatsapp'), 
                 productName: inquire.name,
                 message: data.get('message') 
               };
               try {
                 const res = await fetch('http://localhost:5055/api/custom-request', { 
                   method: 'POST', 
                   headers: { 'Content-Type': 'application/json' }, 
                   body: JSON.stringify({
                     ...formData,
                     surah: "Inquiry: " + inquire.name,
                     size: "Original",
                     requirements: formData.message
                   }) 
                 });
                 if (res.ok) { 
                   alert("Inquiry sent successfully!"); 
                   setInquire(null); 
                 } else {
                   const errData = await res.json();
                   alert(errData.error || "Failed to send inquiry.");
                 }
               } catch (e) { alert("Error connecting to server. Please check if the backend is running."); }
             }} style={{display:"flex",flexDirection:"column",gap:16}}>
               <input name="name" placeholder="Your Name" required onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')} style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
               <input name="whatsapp" placeholder="Instagram Username or Contact" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
               <textarea name="message" placeholder="I am interested in this piece..." style={{padding:14,borderRadius:10,border:"1.5px solid #eee",minHeight:100}}/>
               <button type="submit" style={{padding:15,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:700,borderRadius:8}}>SEND INQUIRY</button>
               <a href={`https://ig.me/m/_.artsy.donut._`} target="_blank" rel="noreferrer" style={{textAlign:"center",color:"#E1306C",fontWeight:600,textDecoration:"none",fontSize:14}}>Or DM on Instagram Directly</a>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}