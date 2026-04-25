import React from 'react';
import { supabase } from '../supabaseClient';

const CheckoutModal = ({ setCheckoutOpen, cart, total, advance, setLastOrderId, setCart }) => {
  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={()=>setCheckoutOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
        <button onClick={()=>setCheckoutOpen(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#6b7280"}}>✕</button>
        <div style={{textAlign:"center",marginBottom:32}}>
          <p style={{color:"var(--color-gold)",letterSpacing:4,fontSize:11,fontWeight:700,marginBottom:8}}>SECURE CHECKOUT</p>
          <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,fontWeight:700,color:"var(--color-jade)",margin:0}}>Complete Your Order</h3>
        </div>
        
        <div style={{background:"#f9f8f4",borderRadius:12,padding:20,marginBottom:28,border:"1px solid #eee"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"#666"}}>Cart Total:</span>
            <span style={{fontWeight:700,color:"var(--color-jade)"}}>Rs. {total.toLocaleString()}</span>
          </div>
          <p style={{fontSize:11, color:"#999", margin:"8px 0 0", fontStyle:"italic"}}>* Note: Delivery charges are not included.</p>
        </div>

        <div style={{background:"var(--color-jade)",color:"#fff",padding:20,borderRadius:12,marginBottom:32}}>
          <p style={{fontSize:18,fontWeight:700,margin:0}}>JazzCash: +92 303 6192198</p>
          <p style={{fontSize:15,opacity:0.9,margin:0}}>Account Name: Muaz Sajid</p>
        </div>

        <form onSubmit={async (e)=>{
          e.preventDefault();
          const form = e.target;
          if(!form.querySelector('input[type="checkbox"]').checked) return alert("Please confirm payment");
          
          const formData = new FormData(form);
          const file = formData.get('paymentScreenshot');
          let screenshotUrl = null;

          try {
            if (file && file.size > 0) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Math.random()}.${fileExt}`;
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('orders')
                .upload(`screenshots/${fileName}`, file);
              
              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('orders').getPublicUrl(`screenshots/${fileName}`);
              screenshotUrl = publicUrl;
            }

            const paymentOption = formData.get('paymentOption');
            const orientation = formData.get('orientation');
            const { data, error } = await supabase.from('orders').insert([{
              customerName: formData.get('customerName'),
              whatsapp: formData.get('whatsapp'),
              address: `[${orientation}] ${formData.get('address')}`,
              paymentMethod: paymentOption === 'Full' ? "Full Payment Paid" : "70% Advance Paid",
              items: cart,
              totalAmount: total,
              advanceAmount: paymentOption === 'Full' ? total : advance,
              paymentScreenshot: screenshotUrl,
              status: 'Pending Payment'
            }]).select();

            if (error) throw error;

            alert("Order Placed! Please wait up to 4 hours for payment verification."); 
            if (data && data[0]) {
              localStorage.setItem('lastOrderId', data[0].id);
              setLastOrderId(data[0].id);
            }
            setCart([]); 
            setCheckoutOpen(false); 
          } catch (err) {
            alert("Error: " + err.message); 
          }
        }} style={{display:"flex",flexDirection:"column",gap:16}}>
          
          <div style={{marginBottom:8}}>
            <label style={{fontSize:13, fontWeight:700, color:"var(--color-jade)", display:"block", marginBottom:8}}>CHOOSE PAYMENT OPTION</label>
            <div style={{display:"flex", gap:12}}>
              <label style={{flex:1, padding:12, border:"1px solid #ddd", borderRadius:8, display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}>
                <input type="radio" name="paymentOption" value="70%" defaultChecked />
                <span style={{fontSize:13}}>70% Advance (Rs. {advance.toLocaleString()})</span>
              </label>
              <label style={{flex:1, padding:12, border:"1px solid #ddd", borderRadius:8, display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}>
                <input type="radio" name="paymentOption" value="Full" />
                <span style={{fontSize:13}}>Full (Rs. {total.toLocaleString()})</span>
              </label>
            </div>
          </div>

          <div style={{marginBottom:16}}>
            <label style={{fontSize:12, fontWeight:700, color:"#666", display:"block", marginBottom:8}}>ORIENTATION PREFERENCE</label>
            <div style={{display:"flex", gap:10}}>
              <label style={{flex:1, padding:10, border:"1px solid #ddd", borderRadius:8, display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:12, background:"#fff"}}>
                <input type="radio" name="orientation" value="Vertical" defaultChecked /> ↕️ Vertical
              </label>
              <label style={{flex:1, padding:10, border:"1px solid #ddd", borderRadius:8, display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:12, background:"#fff"}}>
                <input type="radio" name="orientation" value="Horizontal" /> ↔️ Horizontal
              </label>
            </div>
          </div>

          <input name="customerName" placeholder="Full Name" required style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
          <input name="whatsapp" placeholder="WhatsApp Number" required style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
          <textarea name="address" placeholder="Shipping Address" rows={3} required style={{padding:"14px",borderRadius:10,border:"1.5px solid #eee"}}/>
          
          <div style={{padding:16, border:"1px dashed var(--color-gold)", borderRadius:10, background:"#fffaf0"}}>
            <label style={{fontSize:12, fontWeight:700, color:"var(--color-jade)", display:"block", marginBottom:4}}>UPLOAD PAYMENT SCREENSHOT</label>
            <input name="paymentScreenshot" type="file" accept="image/*" required style={{fontSize:12}} />
          </div>

          <label style={{display:"flex",gap:12,alignItems:"center",cursor:"pointer", fontSize:13}}><input type="checkbox" required /> I have paid the amount.</label>
          <button type="submit" style={{width:"100%",padding:"15px",borderRadius:8,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:700}}>CONFIRM ORDER</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
