import React from 'react';
import { supabase } from '../supabaseClient';

const InquiryModal = ({ inquire, setInquire }) => {
  if (!inquire) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={()=>setInquire(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div className="modal-container" style={{position:"relative",background:"#fff",borderRadius:20,padding:40,maxWidth:600,width:"100%",boxShadow:"0 32px 64px rgba(0,0,0,0.3)"}}>
         <button onClick={()=>setInquire(null)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,cursor:"pointer"}}>✕</button>
         <div style={{textAlign:"center",marginBottom:24}}>
           <h3 style={{fontFamily:"var(--font-serif)",fontSize:32,color:"var(--color-jade)",margin:"0 0 8px"}}>
             {inquire.isStatusInquiry ? "Inquire About Status" : "Inquire About Item"}
           </h3>
           <p style={{color:"var(--color-gold)",fontWeight:600}}>
             {inquire.name} {inquire.price > 0 ? `— Rs. ${inquire.price.toLocaleString()}` : ""}
           </p>
         </div>
         <form onSubmit={async (e)=>{
            e.preventDefault();
            const data = new FormData(e.target);
            try {
              const { error } = await supabase.from('custom_requests').insert([{
                name: data.get('name'), 
                whatsapp: data.get('whatsapp'), 
                surah: "Status Inquiry",
                size: "N/A",
                requirements: data.get('message'),
                status: 'Pending'
              }]);
              if (!error) { alert("Inquiry sent successfully! We will get back to you."); setInquire(null); }
              else throw error;
            } catch (e) { alert("Error: " + e.message); }
          }} style={{display:"flex",flexDirection:"column",gap:16}}>
           <input name="name" placeholder="Your Name" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
           <input name="whatsapp" placeholder="Instagram or WhatsApp" required style={{padding:14,borderRadius:10,border:"1.5px solid #eee"}}/>
           <textarea 
            name="message" 
            placeholder="I am inquiring about my status..." 
            defaultValue={inquire.isStatusInquiry ? `I am inquiring about why my request (ID: ${inquire.name.split('ID: ')[1]}) was ${inquire.isStatusInquiry ? 'updated' : ''}.` : ""}
            style={{padding:14,borderRadius:10,border:"1.5px solid #eee",minHeight:100}}
           />
           <button type="submit" style={{padding:15,background:"var(--color-jade)",color:"var(--color-gold)",fontWeight:700,borderRadius:8}}>SEND INQUIRY</button>
         </form>
      </div>
    </div>
  );
};

export default InquiryModal;
