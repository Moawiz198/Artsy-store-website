import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const CustomOrderModal = ({ setCustomModalOpen }) => {
  const [category, setCategory] = useState('Art');
  const [orientation, setOrientation] = useState('Vertical');

  const sizes = [
    "4x4 inches", "6x6 inches", "8x8 inches", "8x10 inches", 
    "10x10 inches", "10x12 inches", "12x12 inches", "12x16 inches", 
    "12x18 inches", "16x20 inches", "18x24 inches", "24x36 inches", "Standard/Other"
  ];

  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={()=>setCustomModalOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
          <button onClick={()=>setCustomModalOpen(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer"}}>✕</button>
          <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,color:"var(--color-jade)",marginBottom:12,textAlign:"center"}}>Custom Order Request</h3>
          
          <div style={{display:"flex",gap:10,marginBottom:16,justifyContent:"center"}}>
            <button type="button" onClick={()=>setCategory('Art')} className={`category-toggle-btn ${category==='Art'?'active':''}`} style={{flex:1}}>🎨 Art</button>
            <button type="button" onClick={()=>setCategory('Crochet')} className={`category-toggle-btn ${category==='Crochet'?'active':''}`} style={{flex:1}}>🧶 Crochet</button>
          </div>

          <div style={{marginBottom:20}}>
            <label style={{fontSize:12, fontWeight:700, color:"#666", display:"block", marginBottom:8}}>ORIENTATION</label>
            <div style={{display:"flex", gap:10}}>
               <button 
                type="button"
                onClick={()=>setOrientation('Vertical')}
                style={{flex:1, padding:12, borderRadius:8, border:orientation==='Vertical'?'2px solid var(--color-jade)':'1.5px solid #eee', background:orientation==='Vertical'?'#f0fdf4':'#fff', cursor:"pointer", fontWeight:700, fontSize:13}}
               >
                 ↕️ Vertical
               </button>
               <button 
                type="button"
                onClick={()=>setOrientation('Horizontal')}
                style={{flex:1, padding:12, borderRadius:8, border:orientation==='Horizontal'?'2px solid var(--color-jade)':'1.5px solid #eee', background:orientation==='Horizontal'?'#f0fdf4':'#fff', cursor:"pointer", fontWeight:700, fontSize:13}}
               >
                 ↔️ Horizontal
               </button>
            </div>
          </div>

          <form onSubmit={async (e)=>{
            e.preventDefault();
            const formData = new FormData(e.target);
            const file = formData.get('image');
            let imageUrl = null;

            try {
              if (file && file.size > 0) {
                const { data, error: upError } = await supabase.storage.from('orders').upload(`custom/${Date.now()}`, file);
                if (upError) throw upError;
                imageUrl = supabase.storage.from('orders').getPublicUrl(data.path).data.publicUrl;
              }

              const { data, error } = await supabase.from('custom_requests').insert([{
                name: formData.get('name'),
                whatsapp: formData.get('whatsapp'),
                instagram: formData.get('instagram'),
                surah: category === 'Art' ? formData.get('surah') : 'Crochet Request',
                size: category === 'Art' ? formData.get('size') : 'Custom',
                colors: category === 'Crochet' ? formData.get('colors') : 'N/A',
                requirements: `[${orientation}] ${formData.get('requirements')}`,
                image: imageUrl,
                status: 'Pending'
              }]).select();

              if (error) throw error;
              alert("Custom Request Sent!"); 
              if (data && data[0]) localStorage.setItem('lastRequestId', data[0].id);
              setCustomModalOpen(false); 
              window.location.reload();
            } catch (err) { alert("Error: " + err.message); }
          }} style={{display:"flex",flexDirection:"column",gap:16}}>
            
            <input name="name" placeholder="Full Name" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input 
                name="whatsapp" 
                type="tel"
                placeholder="WhatsApp Number" 
                required 
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}
              />
              <input name="instagram" placeholder="Instagram (Optional)" style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
            </div>

            {category === 'Art' && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <input name="surah" placeholder="Surah / Text" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
                <select name="size" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee", background:"#fff"}}>
                  {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <textarea name="requirements" placeholder="Additional Details..." rows={3} required style={{padding:14,borderRadius:10,border:"1.5px solid #eee", resize:"none"}}/>
            <div style={{fontSize:11, color:"#999"}}>Upload reference image (Optional):</div>
            <input name="image" type="file" accept="image/*" style={{fontSize:12}}/>

            <button type="submit" style={{padding:16,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:800,borderRadius:10,border:"none",cursor:"pointer"}}>
              SEND CUSTOM REQUEST
            </button>
          </form>
      </div>
    </div>
  );
};

export default CustomOrderModal;
