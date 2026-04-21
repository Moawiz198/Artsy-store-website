import React from 'react';

export default function AdminDashboard({ 
  orders, setOrders, 
  requests, setRequests, 
  dbProducts, setDbProducts, 
  setAdminAuth, setView 
}) {
  return (
    <div style={{background:"#f3f4f6",minHeight:"100vh",padding:40,fontFamily:"var(--font-sans)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
          <div>
            <h1 style={{fontSize:32,fontWeight:800,color:"var(--color-jade)",margin:0}}>Owner Dashboard <span style={{fontSize:14,color:"var(--color-gold)",background:"var(--color-jade)",padding:"2px 8px",borderRadius:4}}>V2 - Logic Fixed</span></h1>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background: "#10b981"}}></div>
              <span style={{fontSize:12,color:"#6b7280",fontWeight:600}}>
                Server Port: 5055 (Active)
              </span>
            </div>
            <p style={{color:"#6b7280",marginTop:4}}>Manage your shop, orders, and custom requests.</p>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>{
              fetch('http://localhost:5055/api/orders').then(r=>r.json()).then(setOrders);
              fetch('http://localhost:5055/api/custom-requests').then(r=>r.json()).then(setRequests);
              fetch('http://localhost:5055/api/products').then(r=>r.json()).then(setDbProducts);
              alert("Data Refreshed!");
            }} style={{padding:"10px 20px",borderRadius:8,background:"#fff",border:"1.5px solid #ddd",fontWeight:600,cursor:"pointer"}}>
              🔄 Refresh Data
            </button>
            <button onClick={()=>{setAdminAuth(false);setView('welcome')}} style={{padding:"10px 20px",borderRadius:8,background:"var(--color-jade)",color:"#fff",border:"none",fontWeight:600,cursor:"pointer"}}>
              Logout
            </button>
          </div>
        </div>

        <div style={{display:"grid",gap:40}}>
          {/* Add Product Section */}
          <section style={{background:"#fff",padding:32,borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
            <h2 style={{fontSize:22,marginBottom:24,color:"var(--color-jade)"}}>➕ Add New Item to Shop</h2>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const form = e.target;
              const formData = new FormData(form);
              try {
                const res = await fetch('http://localhost:5055/api/products', { method: 'POST', body: formData });
                if(res.ok) {
                  alert("Product added successfully!");
                  form.reset();
                  fetch('http://localhost:5055/api/products').then(r=>r.json()).then(setDbProducts);
                } else {
                  const errData = await res.json();
                  alert("Error: " + (errData.error || "Failed to add product"));
                }
              } catch(err) { alert("Error connecting to server"); }
            }} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,alignItems:"end"}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>NAME</label>
                <input name="name" type="text" placeholder="Product Name" required style={{padding:10,borderRadius:8,border:"1.5px solid #eee"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>PRICE (PKR)</label>
                <input name="price" type="number" placeholder="2500" required style={{padding:10,borderRadius:8,border:"1.5px solid #eee"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>CATEGORY</label>
                <select name="tag" required style={{padding:10,borderRadius:8,border:"1.5px solid #eee",background:"#fff"}}>
                  <option value="Calligraphy">Calligraphy</option>
                  <option value="Painting">Painting</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Canvas">Canvas</option>
                  <option value="Textured">Textured</option>
                  <option value="Crochet">Crochet</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>IMAGE</label>
                <input name="image" type="file" accept="image/*" required style={{fontSize:10}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontWeight:700}}>VIDEO (OPTIONAL)</label>
                <input name="video" type="file" accept="video/*" style={{fontSize:10}}/>
              </div>
              <button type="submit" style={{padding:12,borderRadius:8,background:"var(--color-gold)",color:"var(--color-jade)",border:"none",fontWeight:800,cursor:"pointer"}}>
                SAVE
              </button>
            </form>
          </section>

          {/* Orders Section */}
          <section>
            <h2 style={{fontSize:24,marginBottom:20,color:"#1f2937"}}>Orders ({orders && orders.length ? orders.length : 0})</h2>
            <div className="admin-table-container" style={{background:"#fff",borderRadius:12,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
                <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                  <tr>
                    <th style={{padding:"16px 24px"}}>Customer</th>
                    <th style={{padding:"16px 24px"}}>Contact / Insta</th>
                    <th style={{padding:"16px 24px"}}>Items</th>
                    <th style={{padding:"16px 24px"}}>Total / Advance</th>
                    <th style={{padding:"16px 24px"}}>Status</th>
                    <th style={{padding:"16px 24px"}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) && orders.length > 0 ? orders.map(o=>(
                    <tr key={o._id} style={{
                      borderBottom:"1px solid #f3f4f6", 
                      background: o.isFullPaid ? "#dcfce7" : (o.isPaid ? "#f0fdf4" : "transparent")
                    }}>
                      <td style={{padding:"16px 24px"}}>
                        <div style={{fontWeight:600}}>{o.customerName}</div>
                        <div style={{fontSize:12,color:"#6b7280"}}>{o.address}</div>
                      </td>
                      <td style={{padding:"16px 24px"}}>{o.whatsapp}</td>
                      <td style={{padding:"16px 24px"}}>
                        {Array.isArray(o.items) ? o.items.map(i=>i.name).join(', ') : 'No items'}
                      </td>
                      <td style={{padding:"16px 24px"}}>
                        <div>Rs. {o.totalAmount}</div>
                        <div style={{color:"var(--color-gold)",fontWeight:700}}>Adv: Rs. {o.advanceAmount}</div>
                      </td>
                      <td style={{padding:"16px 24px"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <button 
                            onClick={async ()=>{
                              try {
                                const res = await fetch('http://localhost:5055/api/orders/'+o._id, {
                                  method: 'PATCH',
                                  headers: {'Content-Type':'application/json'},
                                  body: JSON.stringify({isPaid: !o.isPaid})
                                });
                                if(res.ok) {
                                  alert("Advance status updated!");
                                  fetch('http://localhost:5055/api/orders').then(r=>r.json()).then(setOrders);
                                } else {
                                  const errData = await res.json();
                                  alert("Error: " + (errData.error || "Failed to update advance payment"));
                                }
                              } catch(e) { alert("Server error: " + e.message); }
                            }}
                            style={{padding:"6px 10px",borderRadius:6,border:"none",background: o.isPaid ? "#10b981" : "#ef4444",color: "#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                            ADV: {o.isPaid ? "PAID" : "UNPAID"}
                          </button>
                          <button 
                            onClick={async ()=>{
                              try {
                                const res = await fetch('http://localhost:5055/api/orders/'+o._id, {
                                  method: 'PATCH',
                                  headers: {'Content-Type':'application/json'},
                                  body: JSON.stringify({isFullPaid: !o.isFullPaid})
                                });
                                if(res.ok) {
                                  alert("Full payment status updated!");
                                  fetch('http://localhost:5055/api/orders').then(r=>r.json()).then(setOrders);
                                } else {
                                  const errData = await res.json();
                                  alert("Error: " + (errData.error || "Failed to update full payment"));
                                }
                              } catch(e) { alert("Server error: " + e.message); }
                            }}
                            style={{padding:"6px 10px",borderRadius:6,border:"none",background: o.isFullPaid ? "#10b981" : "#ef4444",color: "#fff",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                            FULL: {o.isFullPaid ? "PAID" : "UNPAID"}
                          </button>
                        </div>
                      </td>
                      <td style={{padding:"16px 24px",fontSize:12,color:"#6b7280"}}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{padding:40,textAlign:"center",color:"#9ca3af"}}>No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Products Section */}
          <section>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
              <h2 style={{fontSize:24,color:"#1f2937",margin:0}}>Manage Products ({dbProducts.length})</h2>
              <span style={{fontSize:12,color:"#6b7280"}}>*Only newly added products can be edited/deleted</span>
            </div>
            <div className="admin-table-container" style={{background:"#fff",borderRadius:12,boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)",overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
                <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                  <tr>
                    <th style={{padding:"16px 24px"}}>Item</th>
                    <th style={{padding:"16px 24px"}}>Price</th>
                    <th style={{padding:"16px 24px"}}>Category</th>
                    <th style={{padding:"16px 24px"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(dbProducts) && dbProducts.map(p=>(
                    <tr key={p._id} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12}}>
                        <img 
                          src={typeof p.image === 'string' && p.image.includes('localhost') ? p.image.replace(':5000', ':5055') : p.image} 
                          style={{width:40,height:40,borderRadius:4,objectFit:"cover"}}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Error'; }}
                        />
                        <div>
                          <div style={{fontWeight:600}}>{p.name}</div>
                          {p.video && <div style={{fontSize:10,color:"#10b981"}}>🎥 Has Video</div>}
                        </div>
                      </td>
                      <td style={{padding:"16px 24px"}}>Rs. {p.price}</td>
                      <td style={{padding:"16px 24px"}}>{p.tag}</td>
                      <td style={{padding:"16px 24px",display:"flex",gap:8}}>
                        <button onClick={async ()=>{
                          const newPrice = prompt("Enter new price", p.price);
                          if(newPrice) {
                            try {
                              const res = await fetch('http://localhost:5055/api/products/'+p._id, {
                                method: 'PATCH',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({price: Number(newPrice)})
                              });
                              if(res.ok) { alert("Price updated!"); fetch('http://localhost:5055/api/products').then(r=>r.json()).then(setDbProducts); }
                            } catch(err) { alert("Error connecting to server"); }
                          }
                        }} style={{padding:"6px 12px",borderRadius:6,border:"1px solid #ddd",fontSize:12,cursor:"pointer"}}>Edit</button>
                        <button onClick={async ()=>{
                          if(window.confirm("Delete " + p.name + "?")) {
                            try {
                              const res = await fetch('http://localhost:5055/api/products/'+p._id, { method: 'DELETE' });
                              if(res.ok) { alert("Product deleted!"); fetch('http://localhost:5055/api/products').then(r=>r.json()).then(setDbProducts); }
                            } catch(err) { alert("Error connecting to server"); }
                          }
                        }} style={{padding:"6px 12px",borderRadius:6,background:"#fee2e2",color:"#ef4444",border:"none",fontSize:12,cursor:"pointer"}}>Delete</button>
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
                    <th style={{padding:"16px 24px"}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(requests) && requests.map(r=>(
                    <tr key={r._id} style={{borderBottom:"1px solid #f3f4f6"}}>
                      <td style={{padding:"16px 24px"}}>
                        <div style={{fontWeight:600}}>{r.name}</div>
                        <div style={{fontSize:12}}>{r.whatsapp}</div>
                      </td>
                      <td style={{padding:"16px 24px"}}>
                        <div><strong>Surah:</strong> {r.surah}</div>
                        <div><strong>Size:</strong> {r.size}</div>
                        {r.colors && r.colors !== 'N/A' && <div><strong>Colors:</strong> {r.colors}</div>}
                        <div style={{fontSize:13,color:"#4b5563",marginTop:4}}>{r.requirements}</div>
                      </td>
                      <td style={{padding:"16px 24px",fontSize:12,color:"#6b7280"}}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
