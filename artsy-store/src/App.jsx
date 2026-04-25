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
import ConfigurableProductModal from './components/ConfigurableProductModal';
import Preloader from './components/Preloader';
import CustomOrderModal from './components/CustomOrderModal';
import CheckoutModal from './components/CheckoutModal';
import InquiryModal from './components/InquiryModal';
import { supabase } from './supabaseClient';


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
  const [cart, setCart]           = useState(() => {
    try {
      const saved = localStorage.getItem('artsy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
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
  const [configurableProduct, setConfigurableProduct] = useState(null);

  const [lastOrderId, setLastOrderId] = useState(localStorage.getItem('lastOrderId'));
  const [orderStatus, setOrderStatus] = useState(null);

  const [lastRequestId, setLastRequestId] = useState(localStorage.getItem('lastRequestId'));
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    localStorage.setItem('artsy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const hideLoader = () => setLoading(false);
    const timer = setTimeout(hideLoader, 4800); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (lastOrderId) {
      supabase.from('orders').select('*').eq('id', lastOrderId).single()
        .then(({ data }) => { if (data) setOrderStatus(data); });
    }
  }, [lastOrderId]);

  useEffect(() => {
    if (lastRequestId) {
      supabase.from('custom_requests').select('*').eq('id', lastRequestId).single()
        .then(({ data }) => { if (data) setRequestStatus(data); });
    }
  }, [lastRequestId]);

  useEffect(() => {
    supabase.from('products').select('*').order('createdAt', { ascending: false })
      .then(({ data }) => { if (data) setDbProducts(data); });
  }, []);

  useEffect(() => {
    if (view === 'admin' && adminAuth) {
      supabase.from('orders').select('*').order('createdAt', { ascending: false })
        .then(({ data }) => { if (data) setOrders(data); });
      supabase.from('custom_requests').select('*').order('createdAt', { ascending: false })
        .then(({ data }) => { if (data) setRequests(data); });
    }
  }, [view, adminAuth]);

  const addToCart = (p) => setCart(c => [...c, p]);
  const removeFromCart = (i) => setCart(c => c.filter((_,idx)=>idx!==i));
  const total = cart.reduce((s,i)=>s+i.price,0);
  const advance = Math.round(total * 0.70);

  const allProducts = [...initialProducts, ...dbProducts];
  const tags = ['All', ...new Set(allProducts.map(p => p.tag)), 'Crochet'];
  const visible = activeTag === 'All' ? allProducts : allProducts.filter(p => p.tag === activeTag);

  return (
    <div style={{fontFamily:"var(--font-sans)",background:"var(--color-cream)",minHeight:"100vh",overflowX:"hidden"}}>
      {loading && <Preloader onFinish={() => setLoading(false)} />}

      {view === 'admin' ? (
        adminAuth ? (
          <AdminDashboard 
            orders={orders} setOrders={setOrders} 
            requests={requests} setRequests={setRequests} 
            dbProducts={dbProducts} setDbProducts={setDbProducts} 
            setAdminAuth={setAdminAuth} setView={setView}
            initialProducts={initialProducts} 
          />
        ) : (
          <div style={{height:"100vh",background:"#0a1a14",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
            <div className="modal-container" style={{background:"#fff",padding:40,borderRadius:20,width:"100%",maxWidth:400,textAlign:"center"}}>
              <h2 style={{fontFamily:"var(--font-serif)",fontSize:28,color:"var(--color-jade)",marginBottom:12}}>Admin Access</h2>
              <form onSubmit={(e)=>{
                e.preventDefault();
                const correctPass = import.meta.env.VITE_ADMIN_PASSWORD || 'artsy123';
                if(passInput === correctPass) setAdminAuth(true);
                else alert("Incorrect password!");
              }}>
                <input type="password" placeholder="Password" autoFocus value={passInput} onChange={e=>setPassInput(e.target.value)} style={{width:"100%",padding:14,borderRadius:10,border:"1.5px solid #eee",marginBottom:20,textAlign:"center"}}/>
                <button type="submit" style={{width:"100%",padding:14,borderRadius:10,background:"var(--color-jade)",color:"var(--color-gold)",border:"none",fontWeight:700}}>LOGIN</button>
                <button onClick={()=>setView('customer')} style={{marginTop:16,background:"none",border:"none",color:"#999",fontSize:13}}>Cancel</button>
              </form>
            </div>
          </div>
        )
      ) : (
        <>
          {orderStatus && (
            <div style={{background:"var(--color-gold)", padding:"14px 24px", textAlign:"center", fontSize:14, fontWeight:700, color:"var(--color-jade)", position:"relative", zIndex:1001}}>
              ✨ Order Tracking: <span style={{ marginLeft: 8, padding: "4px 12px", background: "var(--color-jade)", color: "var(--color-gold)", borderRadius: 6 }}>{orderStatus.status}</span> 
              <button 
                onClick={() => {
                  const items = orderStatus.items.map(i => i.name).join(', ');
                  const msg = encodeURIComponent(`Hi, I ordered ${items}. Please tell me the status of my order.`);
                  window.open(`https://wa.me/923036192198?text=${msg}`, '_blank');
                }}
                style={{marginLeft:16, background:"var(--color-jade)", color:"#fff", border:"none", padding:"4px 10px", borderRadius:4, fontSize:10, fontWeight:800, cursor:"pointer"}}
              >
                TRACK ON WHATSAPP
              </button>
              <button onClick={()=>{setOrderStatus(null); localStorage.removeItem('lastOrderId');}} style={{marginLeft:20, background:"none", border:"none", textDecoration:"underline", fontSize:11}}>Clear</button>
            </div>
          )}

          {requestStatus && (
            <div style={{background:"var(--color-jade)", padding:"14px 24px", textAlign:"center", fontSize:14, fontWeight:700, color:"var(--color-gold)", position:"relative", zIndex:1001}}>
              🎨 Request Status: <span style={{ marginLeft: 8, padding: "4px 12px", background: "var(--color-gold)", color: "var(--color-jade)", borderRadius: 6 }}>{requestStatus.status}</span>
              <button 
                onClick={() => {
                  let msg = "";
                  if (requestStatus.status === 'Rejected') {
                    msg = "Hi, I ordered a custom design and it was rejected. Why is that? \n";
                  } else if (requestStatus.status === 'Accepted') {
                    msg = "Hi, I ordered a custom design and it was accepted. Please send me my bill.";
                  } else {
                    msg = "Hi, I am inquiring about my custom request status.";
                  }
                  window.open(`https://wa.me/923036192198?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                style={{marginLeft:16, background:"#fff", color:"var(--color-jade)", border:"none", padding:"4px 10px", borderRadius:4, fontSize:10, fontWeight:800, cursor:"pointer"}}
              >
                ASK ON WHATSAPP
              </button>
              <button onClick={()=>{setRequestStatus(null); localStorage.removeItem('lastRequestId');}} style={{marginLeft:20, background:"none", border:"none", textDecoration:"underline", fontSize:11, color:"#fff"}}>Clear</button>
            </div>
          )}

          <Navbar logo={logo} cartCount={cart.length} setCartOpen={setCartOpen} setView={setView} setCustomModalOpen={setCustomModalOpen} />
          <Hero img4000={img4000} allProductsCount={allProducts.length} setCustomModalOpen={setCustomModalOpen} />
          <Mission />

          <section id="shop" style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{color:"var(--color-gold)",letterSpacing:4,fontSize:12,marginBottom:12}}>CURATED COLLECTION</p>
              <h2 style={{fontFamily:"var(--font-serif)",fontSize:44,fontWeight:700,color:"var(--color-jade)",margin:"0 auto 8px"}}>Featured Artworks</h2>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
              {tags.map(t=>(
                <button key={t} onClick={()=>setActiveTag(t)} style={{padding:"8px 22px",borderRadius:50,border:`1.5px solid ${activeTag===t?"var(--color-gold)":"#d1c9b8"}`,background:activeTag===t?"var(--color-gold)":"transparent",color:activeTag===t?"var(--color-jade)":"#6b7280",fontWeight:600,fontSize:13}}>
                  {t}
                </button>
              ))}
            </div>

            <div className="shop-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:32}}>
              {visible.map(p=>(
                <ProductCard key={p.id || p._id} product={p} addToCart={(item) => setConfigurableProduct(item)} setInquire={setInquire} />
              ))}
            </div>
          </section>

          <Contact />

          <footer style={{background:"#0a1f14",color:"#6b7a63",textAlign:"center",padding:"32px 24px"}}>
            <p style={{fontFamily:"var(--font-serif)",fontSize:22,color:"var(--color-gold)",marginBottom:8}}>artsy.donut</p>
            <button onClick={()=>setView('admin')} style={{marginTop:20,background:"transparent",border:"1px solid #1a3a2a",color:"#3a4a3a",fontSize:11,padding:"4px 10px",borderRadius:4}}>Admin Portal</button>
          </footer>

          {cartOpen && <CartDrawer cart={cart} setCartOpen={setCartOpen} removeFromCart={removeFromCart} setCheckoutOpen={setCheckoutOpen} total={total} advance={advance} />}
          {checkoutOpen && <CheckoutModal setCheckoutOpen={setCheckoutOpen} cart={cart} total={total} advance={advance} setLastOrderId={setLastOrderId} setCart={setCart} />}
          {customModalOpen && <CustomOrderModal setCustomModalOpen={setCustomModalOpen} />}
          {inquire && <InquiryModal inquire={inquire} setInquire={setInquire} />}
          {configurableProduct && <ConfigurableProductModal product={configurableProduct} addToCart={addToCart} onClose={() => setConfigurableProduct(null)} />}
        </>
      )}
    </div>
  );
}