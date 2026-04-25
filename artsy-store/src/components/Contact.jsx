import React from 'react';
import { supabase } from '../supabaseClient';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-info">
          <p className="contact-tagline">GET IN TOUCH</p>
          <h2 className="contact-title">Have a Question?</h2>
          <p className="contact-text">
            Whether you want a custom portrait, a specific Surah in calligraphy, or just want to say hi, I'd love to hear from you.
          </p>
          
          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-detail-icon">📸</span>
              <div>
                <p className="contact-detail-label">Instagram</p>
                <p className="contact-detail-value"><a href="https://ig.me/m/_.artsy.donut._" target="_blank" rel="noreferrer" style={{color:"inherit", textDecoration:"none"}}>@_.artsy.donut._</a></p>
              </div>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon">📍</span>
              <div>
                <p className="contact-detail-label">Location</p>
                <p className="contact-detail-value">Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={async (e) => { 
          e.preventDefault(); 
          const data = new FormData(e.target);
          try {
            const { error } = await supabase.from('custom_requests').insert([{
              name: data.get('name'),
              whatsapp: data.get('whatsapp'),
              requirements: data.get('message'),
              surah: "General Inquiry",
              size: "N/A",
              status: 'Pending'
            }]);

            if (!error) {
              alert("Message sent! I will get back to you on Instagram DM.");
              e.target.reset();
            } else throw error;
          } catch (err) {
            alert("Error: " + err.message);
          }
        }}>
          <div className="form-group">
            <label>YOUR FULL NAME</label>
            <input 
              name="name" 
              type="text" 
              placeholder="e.g. Ahmad Hassan" 
              required 
              onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
            />
          </div>
          <div className="form-group">
            <label>INSTAGRAM USERNAME / CONTACT</label>
            <input 
              name="whatsapp" 
              type="text" 
              placeholder="e.g. @your_id or Phone" 
              required 
            />
          </div>
          <div className="form-group">
            <label>YOUR MESSAGE</label>
            <textarea name="message" placeholder="Write your message here..." rows="5" required></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{width:"100%", marginTop:10}}>SEND MESSAGE</button>
        </form>
      </div>
    </section>
  );
}
