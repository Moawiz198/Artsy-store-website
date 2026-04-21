const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const CustomRequest = require('./models/CustomRequest');
const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
const PORT = 5055;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'artsy-store',
      resource_type: 'auto', // Automatically detect image or video
      public_id: Date.now() + '-' + file.originalname.split('.')[0]
    };
  },
});

const upload = multer({ storage });

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of hanging
})
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('TIP: Make sure your IP address is whitelisted in MongoDB Atlas.');
  });

// ── HELPER: Save to JSON Fallback ──
const saveToLocal = (filename, data) => {
  const filePath = path.join(__dirname, 'backups', filename);
  let existing = [];
  if (fs.existsSync(filePath)) {
    try { existing = JSON.parse(fs.readFileSync(filePath)); } catch(e) { existing = []; }
  }
  existing.push({ ...data, _id: Date.now().toString(), createdAt: new Date(), isLocal: true });
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
};

const getFromLocal = (filename) => {
  const filePath = path.join(__dirname, 'backups', filename);
  if (fs.existsSync(filePath)) {
    try { return JSON.parse(fs.readFileSync(filePath)); } catch(e) { return []; }
  }
  return [];
};

const updateLocal = (filename, id, data) => {
  const filePath = path.join(__dirname, 'backups', filename);
  if (fs.existsSync(filePath)) {
    try {
      let existing = JSON.parse(fs.readFileSync(filePath));
      const index = existing.findIndex(item => item._id === id);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...data };
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
        return existing[index];
      }
    } catch(e) { return null; }
  }
  return null;
};

// ── ROUTES ──

// 1. Submit Custom Design Request
app.post('/api/custom-request', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ DB Offline. Saving custom request to local JSON.");
      saveToLocal('requests.json', req.body);
      return res.status(201).json({ message: 'Saved locally (Database Offline)' });
    }
    const newRequest = new CustomRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Submit Checkout Order
app.post('/api/checkout', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ DB Offline. Saving order to local JSON.");
      saveToLocal('orders.json', req.body);
      return res.status(201).json({ message: 'Order placed locally (Database Offline)' });
    }
    const newOrder = new Order(req.body);
    await newOrder.save();
    console.log("✅ New Order Received from:", req.body.customerName);
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 3. Admin: Get all Orders
app.get('/api/orders', async (req, res) => {
  try {
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find().sort({ createdAt: -1 });
    }
    const localOrders = getFromLocal('orders.json');
    res.json([...localOrders, ...orders]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Admin: Get all Custom Requests
app.get('/api/custom-requests', async (req, res) => {
  try {
    let requests = [];
    if (mongoose.connection.readyState === 1) {
      requests = await CustomRequest.find().sort({ createdAt: -1 });
    }
    const localRequests = getFromLocal('requests.json');
    res.json([...localRequests, ...requests]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order (Mark as Paid)
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Try updating local JSON first (for offline orders)
    const localOrder = updateLocal('orders.json', id, req.body);
    if (localOrder) {
      console.log("✅ Local Order Updated:", id);
      return res.json(localOrder);
    }

    // 2. If not local, check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "Database Offline. Please whitelist your IP in MongoDB Atlas to update database orders." 
      });
    }

    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Products: Add New Product (with Image & optional Video)
app.post('/api/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database Offline. Cannot add products." });
    }
    const { name, price, tag } = req.body;
    
    // Cloudinary returns the URL in the 'path' property
    const imageUrl = req.files['image'] ? req.files['image'][0].path : null;
    const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

    if (!imageUrl) return res.status(400).json({ error: "Image is required" });

    const newProduct = new Product({ name, price, tag, image: imageUrl, video: videoUrl });
    await newProduct.save();
    console.log("✅ New Product Added to Cloudinary:", name);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 6. Products: Get All Products
app.get('/api/products', async (req, res) => {
  try {
    // If DB is not connected, don't hang, just return empty list or initial products fallback
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Database not connected. Returning empty products list.");
      return res.json([]); 
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Products: Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    console.log("🗑️ Attempting to delete product:", req.params.id);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    // Optionally delete the physical file too
    const filename = product.image.split('/').pop();
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("📁 File deleted from disk:", filename);
    }
    
    if (product.video) {
        const vidName = product.video.split('/').pop();
        const vidPath = path.join(__dirname, 'uploads', vidName);
        if (fs.existsSync(vidPath)) fs.unlinkSync(vidPath);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 8. Products: Update Product
app.patch('/api/products/:id', async (req, res) => {
  try {
    console.log("📝 Updating product:", req.params.id, req.body);
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Basic Route
app.get('/', (req, res) => res.send('Artsy Donut Backend API is running - VERSION 2.0 (MODERN)'));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
