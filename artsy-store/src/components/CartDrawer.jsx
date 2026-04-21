import React from 'react';

export default function CartDrawer({ cart, setCartOpen, removeFromCart, setCheckoutOpen, total, advance }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:100}}>
      <div onClick={()=>setCartOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:420,maxWidth:"100vw",background:"#fff",display:"flex",flexDirection:"column",boxShadow:"-8px 0 48px rgba(0,0,0,0.2)"}}>
        <div style={{background:"var(--color-jade)",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:22,color:"var(--color-gold)"}}>Your Cart</span>
          <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          {cart.length===0 ? <p style={{color:"#9ca3af",textAlign:"center",marginTop:60}}>Your cart is empty.</p> : cart.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:14,alignItems:"center",borderBottom:"1px solid #f0ebe3",paddingBottom:16,marginBottom:16}}>
              <img src={item.image} alt={item.name} style={{width:64,height:64,objectFit:"cover",borderRadius:8}}/>
              <div style={{flex:1}}>
                <p style={{fontWeight:600,fontSize:14,margin:"0 0 4px"}}>{item.name}</p>
                <p style={{color:"var(--color-jade)",fontWeight:700,fontSize:14,margin:0}}>Rs. {item.price.toLocaleString()}</p>
              </div>
              <button onClick={()=>removeFromCart(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
          ))}
        </div>
        <div style={{padding:24,borderTop:"1px solid #f0ebe3",background:"#faf9f6"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:18,marginBottom:4}}>
            <span>Subtotal</span><span>Rs. {total.toLocaleString()}</span>
          </div>
          <p style={{fontSize:11,color:"#6b7280",textAlign:"right",margin:"0 0 16px"}}>*Delivery charges not included</p>

          <div style={{background:"#fff8e1",padding:10,borderRadius:8,border:"1px solid #ffe082",marginBottom:20}}>
            <p style={{fontSize:11,color:"#856404",margin:0,lineHeight:1.4}}>
              <strong>Note:</strong> Delivery charges depend on <strong>package weight</strong> and your <strong>city</strong>.
            </p>
          </div>

          <button 
            disabled={cart.length===0} 
            onClick={()=>{
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
            style={{width:"100%",padding:"14px",borderRadius:8,border:"none",background:cart.length?"var(--color-jade)":"#d1d5db",color:cart.length?"var(--color-gold)":"#9ca3af",fontWeight:700,fontSize:15,cursor:cart.length?"pointer":"not-allowed",letterSpacing:1}}>
            CHECKOUT NOW
          </button>
        </div>
      </div>
    </div>
  );
}
