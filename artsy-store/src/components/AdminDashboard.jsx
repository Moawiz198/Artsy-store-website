import React from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ 
  orders, setOrders, 
  requests, setRequests, 
  dbProducts, setDbProducts, 
  setAdminAuth, setView,
  initialProducts = []
}) {

  const [editingProduct, setEditingProduct] = React.useState(null);
  const [slipData, setSlipData] = React.useState(null);


  return (
    <div style={{background:"#f3f4f6",minHeight:"100vh",padding:40,fontFamily:"var(--font-sans)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
          <div>
            <h1 style={{fontSize:32,fontWeight:800,color:"var(--color-jade)",margin:0}}><span style={{fontWeight:900}}>Aferay Sajid</span> Dashboard</h1>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background: "#10b981"}}></div>
              <span style={{fontSize:12,color:"#6b7280",fontWeight:600}}>
                Database Connection: Supabase (Live)
              </span>
            </div>
            <p style={{color:"#6b7280",marginTop:4}}>Manage your shop, orders, and custom requests.</p>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={async ()=>{
              const { data: o } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
              const { data: r } = await supabase.from('custom_requests').select('*').order('createdAt', { ascending: false });
              const { data: p } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
              if (o) setOrders(o);
              if (r) setRequests(r);
              if (p) setDbProducts(p);
              alert("Data Refreshed!");
            }} style={{padding:"12px 20px",borderRadius:10,background:"#fff",border:"1.5px solid #e5e7eb",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              🔄 Refresh
            </button>

            <button onClick={()=>{setAdminAuth(false); setView('home');}} style={{padding:"12px 20px",borderRadius:10,background:"#ef4444",color:"#fff",border:"none",fontWeight:600,cursor:"pointer"}}>
              Logout
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:24,marginBottom:48}}>
          <div style={{background:"#fff",padding:24,borderRadius:16,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"}}>
            <p style={{margin:0,color:"#6b7280",fontSize:14,fontWeight:600}}>Total Orders</p>
            <h3 style={{margin:"8px 0 0",fontSize:28,color:"var(--color-jade)"}}>{orders.length}</h3>
          </div>
          <div style={{background:"#fff",padding:24,borderRadius:16,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"}}>
            <p style={{margin:0,color:"#6b7280",fontSize:14,fontWeight:600}}>Custom Requests</p>
            <h3 style={{margin:"8px 0 0",fontSize:28,color:"var(--color-jade)"}}>{requests.length}</h3>
          </div>
        </div>

        {/* Manage Orders Section */}
        <section style={{marginBottom:48}}>
          <h2 style={{fontSize:24,marginBottom:20,color:"#1f2937"}}>Manage Orders</h2>
          <div className="admin-table-container" style={{background:"#fff",borderRadius:12,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
              <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                <tr>
                  <th style={{padding:"16px 24px"}}>Customer</th>
                  <th style={{padding:"16px 24px"}}>Items</th>
                  <th style={{padding:"16px 24px"}}>Total</th>
                  <th style={{padding:"16px 24px"}}>Status</th>
                  <th style={{padding:"16px 24px"}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.length > 0 ? orders.map(o=>(
                   <tr key={o.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"16px 24px"}}>
                      <div style={{fontWeight:600}}>{o.customerName}</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>{o.whatsapp}</div>
                    </td>
                    <td style={{padding:"16px 24px",fontSize:14}}>
                      {Array.isArray(o.items) ? o.items.map(i=>i.name).join(', ') : 'No items'}
                    </td>
                    <td style={{padding:"16px 24px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        <div>Rs. {o.totalAmount}</div>
                        <div style={{color:"var(--color-gold)",fontWeight:700,fontSize:12}}>Adv: Rs. {o.advanceAmount}</div>
                        {o.paymentScreenshot ? (
                          <button 
                            onClick={()=>window.open(o.paymentScreenshot, '_blank')}
                            style={{padding:"4px 8px",borderRadius:4,background:"#eff6ff",color:"#2563eb",border:"1px solid #dbeafe",fontSize:10,fontWeight:700,cursor:"pointer",marginTop:4}}
                          >
                            🖼️ VIEW RECEIPT
                          </button>
                        ) : (
                          <span style={{fontSize:9,color:"#9ca3af"}}>No Slip Uploaded</span>
                        )}
                      </div>
                    </td>
                    <td style={{padding:"16px 24px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <div style={{display:"flex", gap: 4}}>
                          <button 
                            onClick={async ()=>{
                              try {
                                const { error } = await supabase.from('orders').update({ isPaid: !o.isPaid }).eq('id', o.id);
                                if(!error) {
                                  alert("Advance status updated!");
                                  const { data } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
                                  if(data) setOrders(data);
                                }
                              } catch(e) { alert("Supabase error"); }
                            }}
                            style={{flex:1, padding:"6px 10px",borderRadius:6,border:"none",background: o.isPaid ? "#10b981" : "#ef4444",color: "#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                            ADV: {o.isPaid ? "PAID" : "UNPAID"}
                          </button>
                          <button 
                            onClick={async ()=>{
                              try {
                                const { error } = await supabase.from('orders').update({ isFullPaid: !o.isFullPaid }).eq('id', o.id);
                                if(!error) {
                                  alert("Full payment status updated!");
                                  const { data } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
                                  if(data) setOrders(data);
                                }
                              } catch(e) { alert("Supabase error"); }
                            }}
                            style={{flex:1, padding:"6px 10px",borderRadius:6,border:"none",background: o.isFullPaid ? "#10b981" : "#ef4444",color: "#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                            FULL: {o.isFullPaid ? "PAID" : "UNPAID"}
                          </button>
                        </div>
                        <button 
                          onClick={() => {
                            const newTotal = prompt("Update Total Price (Rs.)", o.totalAmount);
                            const newAdv = prompt("Update Advance Price (Rs.)", o.advanceAmount);
                            if (newTotal !== null && newAdv !== null) {
                              supabase.from('orders').update({ 
                                totalAmount: Number(newTotal), 
                                advanceAmount: Number(newAdv) 
                              }).eq('id', o.id).then(({error}) => {
                                if(!error) {
                                  alert("Order Updated!");
                                  supabase.from('orders').select('*').order('createdAt', { ascending: false }).then(({data})=>setOrders(data));
                                }
                              });
                            }
                          }}
                          style={{width:"100%", padding:"6px", borderRadius:6, border:"1.5px solid #6366f1", color:"#6366f1", background:"#fff", fontSize:10, fontWeight:700, cursor:"pointer"}}
                        >
                          ✏️ EDIT PRICES
                        </button>
                      </div>
                    </td>
                    <td style={{padding:"16px 24px",fontSize:11,color:"#6b7280"}}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('en-PK', { dateStyle:'short', timeStyle:'short' }) : 'N/A'}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add Product Section */}
        <section style={{marginBottom:48, background:"#fff", padding:32, borderRadius:16, boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"}}>
          <h2 style={{fontSize:24,marginBottom:24,color:"var(--color-jade)",display:"flex",alignItems:"center",gap:12}}>📦 Add New Product</h2>
          <form onSubmit={async (e)=>{
            e.preventDefault();
            const formData = new FormData(e.target);
            const imageFile = formData.get('image');
            const videoFile = formData.get('video');
            
            try {
              let imageUrl = '';
              let videoUrl = null;

              if (imageFile && imageFile.size > 0) {
                const ext = imageFile.name.split('.').pop();
                const path = `products/${Date.now()}.${ext}`;
                const { error: upError } = await supabase.storage.from('products').upload(path, imageFile);
                if (upError) throw new Error("Image Upload Failed: " + upError.message);
                imageUrl = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
              }

              if (videoFile && videoFile.size > 0) {
                const ext = videoFile.name.split('.').pop();
                const path = `products/${Date.now()}.${ext}`;
                const { error: vidError } = await supabase.storage.from('products').upload(path, videoFile);
                if (vidError) throw new Error("Video Upload Failed: " + vidError.message);
                videoUrl = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
              }

              const { error } = await supabase.from('products').insert([{
                name: formData.get('name'),
                price: Number(formData.get('price')),
                tag: formData.get('tag'),
                size: formData.get('size'),
                image: imageUrl,
                video: videoUrl
              }]);

              if(error) throw error;
              alert("Product Added Successfully!"); 
              e.target.reset(); 
              const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
              if(data) setDbProducts(data);
            } catch(err) { alert("Error: " + err.message); }
          }} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>NAME</label>
              <input name="name" placeholder="Item Name" required style={{padding:12,borderRadius:8,border:"1.5px solid #eee"}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>PRICE (PKR)</label>
              <input name="price" type="number" placeholder="2500" required style={{padding:12,borderRadius:8,border:"1.5px solid #eee"}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>CATEGORY</label>
              <select name="tag" required style={{padding:12,borderRadius:8,border:"1.5px solid #eee",background:"#fff"}}>
                <option value="Calligraphy">Calligraphy</option>
                <option value="Painting">Painting</option>
                <option value="Portrait">Portrait</option>
                <option value="Crochet">Crochet</option>
                <option value="Textured">Textured</option>
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>SIZE</label>
              <select name="size" style={{padding:12,borderRadius:8,border:"1.5px solid #eee",background:"#fff"}}>
                <option value="4x4">4x4 inches</option>
                <option value="6x6">6x6 inches</option>
                <option value="8x8">8x8 inches</option>
                <option value="8x10">8x10 inches</option>
                <option value="10x10">10x10 inches</option>
                <option value="10x12">10x12 inches</option>
                <option value="12x12">12x12 inches</option>
                <option value="12x16">12x16 inches</option>
                <option value="12x18">12x18 inches</option>
                <option value="16x20">16x20 inches</option>
                <option value="18x24">18x24 inches</option>
                <option value="24x36">24x36 inches</option>
                <option value="Standard">Standard / Others</option>
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>IMAGE</label>
              <input name="image" type="file" accept="image/*" required style={{fontSize:11}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:"#666"}}>VIDEO (OPTIONAL)</label>
              <input name="video" type="file" accept="video/*" style={{fontSize:11}}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-end"}}>
              <button type="submit" style={{width:"100%",padding:14,borderRadius:8,background:"var(--color-jade)",color:"#fff",fontWeight:700,border:"none",cursor:"pointer",boxShadow:"0 10px 15px -3px rgba(16, 185, 129, 0.2)"}}>
                ➕ ADD PRODUCT
              </button>
            </div>
          </form>
        </section>

        {/* Products Section */}
        <section style={{marginBottom:48}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
            <h2 style={{fontSize:24,color:"#1f2937",margin:0}}>Manage Products ({dbProducts.length})</h2>
            <div style={{display:"flex",gap:12}}>
              <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                style={{padding:"8px 16px",borderRadius:8,background:"var(--color-jade)",color:"#fff",fontWeight:700,border:"none",cursor:"pointer",boxShadow:"0 4px 12px rgba(10,31,20,0.2)"}}
              >
                ➕ ADD NEW PRODUCT
              </button>
            </div>
          </div>
          <div className="admin-table-container" style={{background:"#fff",borderRadius:12,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
              <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                <tr>
                  <th style={{padding:"16px 24px"}}>Product</th>
                  <th style={{padding:"16px 24px"}}>Price</th>
                  <th style={{padding:"16px 24px"}}>Size</th>
                  <th style={{padding:"16px 24px"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(dbProducts) && dbProducts.map(p=>(
                  <tr key={p.id} style={{borderBottom:"1  px solid #f3f4f6"}}>
                    <td style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12}}>
                      <img src={p.image} style={{width:40,height:40,borderRadius:4,objectFit:"cover"}} alt={p.name} />
                      <div style={{fontWeight:600}}>{p.name}</div>
                    </td>
                    <td style={{padding:"16px 24px"}}>Rs. {p.price}</td>
                    <td style={{padding:"16px 24px"}}>{p.size || 'Standard'}</td>
                    <td style={{padding:"16px 24px",display:"flex",gap:8}}>
                      <button onClick={async ()=>{
                        const newPrice = prompt("Update Price for " + p.name, p.price);
                        if(newPrice) {
                          try {
                            const { error } = await supabase.from('products').update({ price: Number(newPrice) }).eq('id', p.id);
                            if(!error) { 
                              alert("Price updated!"); 
                              const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
                              if(data) setDbProducts(data);
                            }
                          } catch(e) { alert("Error"); }
                        }
                      }} style={{padding:"6px 10px",borderRadius:6,border:"1.5px solid #10b981",color:"#10b981",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>💰 Price</button>
                      
                      <button onClick={()=>setEditingProduct(p)} style={{padding:"6px 10px",borderRadius:6,border:"1.5px solid #6366f1",color:"#6366f1",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>✏️ Edit</button>
                      
                      <button onClick={async ()=>{
                        if(window.confirm("Delete?")) {
                          const { error } = await supabase.from('products').delete().eq('id', p.id);
                          if(!error) {
                            const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
                            if(data) setDbProducts(data);
                          }
                        }
                      }} style={{padding:"6px 10px",borderRadius:6,background:"#fee2e2",color:"#ef4444",border:"none",fontSize:11,fontWeight:700,cursor:"pointer"}}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Custom Requests Section */}
        <section>
          <h2 style={{fontSize:24,marginBottom:20,color:"#1f2937"}}>Custom Requests ({requests.length})</h2>
          <div className="admin-table-container" style={{background:"#fff",borderRadius:12,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
              <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                <tr>
                  <th style={{padding:"16px 24px"}}>Customer</th>
                  <th style={{padding:"16px 24px"}}>Request</th>
                  <th style={{padding:"16px 24px"}}>Status</th>
                  <th style={{padding:"16px 24px"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(requests) && requests.map(r=>(
                  <tr key={r.id} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"16px 24px"}}>
                      <div style={{fontWeight:600}}>{r.name}</div>
                      <div style={{fontSize:12,color:"#2563eb"}}>WA: {r.whatsapp}</div>
                      {r.instagram && <div style={{fontSize:12,color:"#db2777"}}>IG: {r.instagram}</div>}
                    </td>
                    <td style={{padding:"16px 24px"}}>
                      <div><strong>Surah:</strong> {r.surah}</div>
                      <div><strong>Size:</strong> {r.size}</div>
                      <div style={{fontSize:13,color:"#4b5563",marginTop:4}}>{r.requirements}</div>
                      {r.image && <a href={r.image} target="_blank" rel="noreferrer"><img src={r.image} style={{width:40,height:40,borderRadius:4,marginTop:8}} alt="Ref" /></a>}
                    </td>
                    <td style={{padding:"16px 24px"}}>
                      <span style={{padding:"4px 8px", borderRadius:4, fontSize:10, fontWeight:700, background: r.status === 'Accepted' ? '#dcfce7' : '#f3f4f6', color: r.status === 'Accepted' ? '#166534' : '#374151'}}>
                        {r.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{padding:"16px 24px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={async ()=>{
                            await supabase.from('custom_requests').update({ status: 'Accepted' }).eq('id', r.id);
                            const { data } = await supabase.from('custom_requests').select('*').order('createdAt', { ascending: false });
                            if(data) setRequests(data);
                          }} style={{flex:1,padding:6,borderRadius:4,background:"#10b981",color:"#fff",border:"none",fontSize:10,cursor:"pointer"}}>Accept</button>
                          
                          <button onClick={async ()=>{
                            await supabase.from('custom_requests').update({ status: 'Rejected' }).eq('id', r.id);
                            const { data } = await supabase.from('custom_requests').select('*').order('createdAt', { ascending: false });
                            if(data) setRequests(data);
                          }} style={{flex:1,padding:6,borderRadius:4,background:"#f59e0b",color:"#fff",border:"none",fontSize:10,cursor:"pointer"}}>Reject</button>
 
                          <button onClick={async ()=>{
                            if(window.confirm("Permanently delete this request?")) {
                              await supabase.from('custom_requests').delete().eq('id', r.id);
                              const { data } = await supabase.from('custom_requests').select('*').order('createdAt', { ascending: false });
                              if(data) setRequests(data);
                            }
                          }} style={{padding:6,borderRadius:4,background:"#fee2e2",color:"#ef4444",border:"none",fontSize:10,cursor:"pointer"}}>🗑️</button>
                        </div>
                        <button onClick={()=>{
                          const isArt = r.category !== 'Crochet';
                          const b = prompt(isArt ? "Canvas Cost (PKR)" : "Base Material Cost (PKR)", 1000);
                          const c = prompt("Colors/Thread Cost (PKR)", 300);
                          const l = prompt("Labour Cost (PKR)", 800);
                          const o = prompt("Additional Custom Charges (PKR)", 500);
                          
                          setSlipData({
                            customerName: r.name,
                            whatsapp: r.whatsapp,
                            category: r.category || 'Art',
                            size: r.size,
                            baseCost: Number(b),
                            colorCost: Number(c),
                            labourCost: Number(l),
                            otherCost: Number(o),
                            total: Number(b) + Number(c) + Number(l) + Number(o),
                            date: new Date().toLocaleDateString()
                          });
                        }} style={{padding:8,borderRadius:4,background:"#6366f1",color:"#fff",border:"none",fontSize:10,fontWeight:700,cursor:"pointer"}}>📄 GENERATE SLIP</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editingProduct && (
        <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={()=>setEditingProduct(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:16,padding:32,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
            <h3 style={{marginTop:0}}>Edit Product: {editingProduct.name}</h3>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const formData = new FormData(e.target);
              const updateData = {
                name: formData.get('name'),
                price: Number(formData.get('price')),
                tag: formData.get('tag'),
                size: formData.get('size')
              };

              const imgFile = formData.get('image');
              const vidFile = formData.get('video');

              try {
                if (imgFile && imgFile.size > 0) {
                  const ext = imgFile.name.split('.').pop();
                  const path = `products/${Date.now()}.${ext}`;
                  await supabase.storage.from('products').upload(path, imgFile);
                  updateData.image = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
                }
                if (vidFile && vidFile.size > 0) {
                  const ext = vidFile.name.split('.').pop();
                  const path = `products/${Date.now()}.${ext}`;
                  await supabase.storage.from('products').upload(path, vidFile);
                  updateData.video = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
                }

                const { error } = await supabase.from('products').update(updateData).eq('id', editingProduct.id);
                if(!error) {
                  setEditingProduct(null); 
                  const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
                  if(data) setDbProducts(data);
                } else throw error;
              } catch(err) { alert("Error: " + err.message); }
            }} style={{display:"flex",flexDirection:"column",gap:16}}>
              <input name="name" defaultValue={editingProduct.name} placeholder="Name" required style={{padding:10,borderRadius:8,border:"1px solid #eee"}}/>
              <input name="price" type="number" defaultValue={editingProduct.price} placeholder="Price" required style={{padding:10,borderRadius:8,border:"1px solid #eee"}}/>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>CATEGORY</label>
                <select name="tag" defaultValue={editingProduct.tag} style={{padding:10,borderRadius:8,border:"1.5px solid #eee",background:"#fff"}}>
                  <option value="Calligraphy">Calligraphy</option>
                  <option value="Painting">Painting</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Crochet">Crochet</option>
                  <option value="Textured">Textured</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>SIZE</label>
                <select name="size" defaultValue={editingProduct.size} style={{padding:10,borderRadius:8,border:"1.5px solid #eee",background:"#fff"}}>
                  <option value="4x4">4x4 inches</option>
                  <option value="6x6">6x6 inches</option>
                  <option value="8x8">8x8 inches</option>
                  <option value="8x10">8x10 inches</option>
                  <option value="10x10">10x10 inches</option>
                  <option value="10x12">10x12 inches</option>
                  <option value="12x12">12x12 inches</option>
                  <option value="12x16">12x16 inches</option>
                  <option value="12x18">12x18 inches</option>
                  <option value="16x20">16x20 inches</option>
                  <option value="18x24">18x24 inches</option>
                  <option value="24x36">24x36 inches</option>
                  <option value="Standard">Standard / Others</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>CHANGE IMAGE (OPTIONAL)</label>
                <input name="image" type="file" accept="image/*" style={{fontSize:10}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>CHANGE VIDEO (OPTIONAL)</label>
                <input name="video" type="file" accept="video/*" style={{fontSize:10}}/>
              </div>
              <div style={{display:"flex",gap:12,marginTop:8}}>
                <button type="submit" style={{flex:1,padding:12,borderRadius:8,background:"var(--color-jade)",color:"#fff",border:"none",fontWeight:700}}>SAVE</button>
                <button type="button" onClick={()=>setEditingProduct(null)} style={{padding:12,borderRadius:8,background:"#f3f4f6",border:"none"}}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {slipData && (
        <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div onClick={()=>setSlipData(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(12px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:24,padding:0,maxWidth:450,width:"100%",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)",overflow:"hidden"}}>
            {/* Slip Header */}
            <div style={{background:"var(--color-jade)",padding:32,textAlign:"center",color:"#fff"}}>
              <div style={{fontSize:24,fontWeight:900,letterSpacing:2}}>ARTSY DONUT</div>
              <div style={{fontSize:10,letterSpacing:4,opacity:0.8,marginTop:4}}>OFFICIAL ORDER SLIP</div>
            </div>
            
            <div style={{padding:32}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:24,borderBottom:"1px solid #eee",paddingBottom:16}}>
                <div>
                  <div style={{fontSize:10,color:"#999",fontWeight:700}}>CUSTOMER</div>
                  <div style={{fontWeight:800,fontSize:18,color:"#1a1a1a",marginBottom:8}}>{slipData.customerName}</div>
                  <div style={{fontSize:10,color:"#999",fontWeight:700}}>CONTACT INFO</div>
                  <div style={{fontSize:12,color:"#666"}}>{slipData.whatsapp}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#999",fontWeight:700}}>DATE</div>
                  <div style={{fontWeight:700}}>{slipData.date}</div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:"#666"}}>
                    {slipData.category === 'Crochet' ? '🧶 Material Cost' : '🖼️ Canvas Cost'} 
                    <span style={{fontSize:11, marginLeft:6, background:"#f3f4f6", padding:"2px 6px", borderRadius:4}}>Size: {slipData.size}</span>
                  </span>
                  <span style={{fontWeight:700}}>Rs. {slipData.baseCost}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:"#666"}}>{slipData.category === 'Crochet' ? '🧵 Thread/Colors' : '🎨 Colors Cost'}</span>
                  <span style={{fontWeight:700}}>Rs. {slipData.colorCost}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:"#666"}}>🛠️ Labour Charges</span>
                  <span style={{fontWeight:700}}>Rs. {slipData.labourCost}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                  <span style={{color:"#666"}}>✨ Custom Requests</span>
                  <span style={{fontWeight:700}}>Rs. {slipData.otherCost}</span>
                </div>
                
                <div style={{marginTop:16,paddingTop:16,borderTop:"2px dashed #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:900,fontSize:18}}>TOTAL AMOUNT</span>
                  <span style={{fontWeight:900,fontSize:24,color:"var(--color-jade)"}}>Rs. {slipData.total}</span>
                </div>
              </div>

              <div style={{marginTop:32,display:"flex",gap:12}}>
                <button 
                  onClick={()=>{
                    window.print();
                  }}
                  style={{flex:1,padding:14,borderRadius:12,background:"#1a1a1a",color:"#fff",fontWeight:700,border:"none",cursor:"pointer"}}
                >
                  🖨️ PRINT SLIP
                </button>
                <button 
                  onClick={()=>setSlipData(null)}
                  style={{padding:14,borderRadius:12,background:"#f3f4f6",fontWeight:700,border:"none",cursor:"pointer"}}
                >
                  CLOSE
                </button>
              </div>
              <p style={{textAlign:"center",fontSize:10,color:"#aaa",marginTop:20}}>Thank you for choosing Artsy Donut!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
