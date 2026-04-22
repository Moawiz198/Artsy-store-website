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
const Settings = require('./models/Settings');

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

// MongoDB Connection with Enhanced Error Handling
const MONGODB_URI = process.env.MONGODB_URI;

const connectWithRetry = () => {
  console.log('📡 Attempting to connect to MongoDB Atlas...');
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Wait 5s before timing out
    connectTimeoutMS: 10000,       // Connection attempt timeout
  })
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    
    if (err.message.includes('querySrv ETIMEOUT')) {
      console.warn('⚠️ DETECTED: DNS Timeout (SRV Record failure).');
      console.warn('CAUSE: Your network (Hostel/Uni WiFi) might be blocking MongoDB SRV records.');
      console.warn('FIX: Try using a VPN or use the "Standard Connection String" (mongodb:// instead of mongodb+srv://) in your .env file.');
    } else if (err.message.includes('Could not connect to any servers in your MongoDB Atlas cluster')) {
      console.warn('⚠️ DETECTED: IP Whitelist Block.');
      console.warn('FIX: Add "0.0.0.0/0" to your Network Access in MongoDB Atlas dashboard.');
    }
    
    console.log('🔄 Fallback: Backend is running in OFFLINE mode (using local JSON storage).');
  });
};

connectWithRetry();

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
app.post('/api/custom-request', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path; // Cloudinary URL

    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ DB Offline. Saving custom request to local JSON.");
      saveToLocal('requests.json', data);
      return res.status(201).json({ message: 'Saved locally (Database Offline)' });
    }
    const newRequest = new CustomRequest(data);
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
    const { name, price, tag, size } = req.body;
    
    // Cloudinary returns the URL in the 'path' property
    const imageUrl = req.files['image'] ? req.files['image'][0].path : null;
    const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

    if (!imageUrl) return res.status(400).json({ error: "Image is required" });

    const newProduct = new Product({ name, price, tag, size, image: imageUrl, video: videoUrl });
    await newProduct.save();
    console.log("✅ New Product Added to Cloudinary:", name);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 7. Bulk Sync Initial Products
app.post('/api/products/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: "Invalid data" });

    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'DB Offline' });

    const results = [];
    for (const p of products) {
      // Check if product already exists by name
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        // For sync, we use a placeholder or keep the local asset string if it's already a URL
        const newP = new Product({ 
          name: p.name, 
          price: p.price, 
          tag: p.tag, 
          image: p.image || 'https://via.placeholder.com/150', // Fallback
          size: p.size || 'Standard'
        });
        await newP.save();
        results.push(newP);
      }
    }
    res.status(201).json({ message: `Synced ${results.length} new products.`, synced: results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
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

// 9. Products: Update Product (Full Edit with Files)
app.patch('/api/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, price, tag, size } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = Number(price);
    if (tag) updateData.tag = tag;
    if (size) updateData.size = size;

    if (req.files) {
      if (req.files['image']) updateData.image = req.files['image'][0].path;
      if (req.files['video']) updateData.video = req.files['video'][0].path;
    }

    if (mongoose.connection.readyState !== 1) {
      // For local fallback, we update the local array (limited support for new files)
      const updatedLocal = updateLocal('products.json', req.params.id, updateData);
      if (updatedLocal) return res.json(updatedLocal);
      return res.status(503).json({ error: 'DB Offline' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Settings: Get Setting
app.get('/api/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    let setting = null;
    if (mongoose.connection.readyState === 1) {
      setting = await Settings.findOne({ key });
    }
    
    if (!setting) {
      const localSettings = getFromLocal('settings.json');
      setting = localSettings.find(s => s.key === key);
    }
    
    // Default values if not found or DB offline
    if (!setting && key === 'space-painting-config') {
      const defaultValue = {
        basePrice: 1250,
        customDesignPrice: 500,
        sizePrices: {
          "4x4": 70, "6x6": 90, "8x8": 110, "8x10": 130, "10x10": 140, "10x12": 150, 
          "12x12": 180, "12x16": 250, "12x18": 300, "16x20": 450, "18x24": 900, "24x36": 2000
        }
      };
      return res.json({ key, value: defaultValue });
    }
    
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Settings: Update/Create Setting
app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ DB Offline. Saving setting to local JSON.");
      const filePath = path.join(__dirname, 'backups', 'settings.json');
      let existing = [];
      if (fs.existsSync(filePath)) {
        try { existing = JSON.parse(fs.readFileSync(filePath)); } catch(e) { existing = []; }
      }
      const index = existing.findIndex(s => s.key === key);
      if (index !== -1) existing[index] = { ...existing[index], value, updatedAt: new Date() };
      else existing.push({ key, value, updatedAt: new Date() });
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
      return res.json({ key, value, message: "Saved locally (DB Offline)" });
    }

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Basic Route
app.get('/', (req, res) => res.send('Artsy Donut Backend API is running - VERSION 2.0 (MODERN)'));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
