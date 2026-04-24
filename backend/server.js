const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const { connectDB, sequelize } = require('./db');
const CustomRequest = require('./models/CustomRequest');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Settings = require('./models/Settings');

const app = express();
const PORT = process.env.PORT || 5055;

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
      resource_type: 'auto',
      public_id: Date.now() + '-' + file.originalname.split('.')[0]
    };
  },
});

const upload = multer({ storage });

// MySQL Connection
connectDB();

// ── HELPER: Save to JSON Fallback ──
const saveToLocal = (filename, data) => {
  const filePath = path.join(__dirname, 'backups', filename);
  let existing = [];
  if (fs.existsSync(filePath)) {
    try { existing = JSON.parse(fs.readFileSync(filePath)); } catch(e) { existing = []; }
  }
  existing.push({ ...data, id: Date.now().toString(), createdAt: new Date(), isLocal: true });
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
      const index = existing.findIndex(item => item.id.toString() === id.toString());
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
    if (req.file) data.image = req.file.path;

    const newRequest = await CustomRequest.create(data);
    res.status(201).json({ message: 'Request submitted successfully!', id: newRequest.id });
  } catch (err) {
    console.error("⚠️ MySQL Error. Falling back to local JSON.");
    saveToLocal('requests.json', req.body);
    res.status(201).json({ message: 'Saved locally (DB Offline)' });
  }
});

// 2. Submit Checkout Order
app.post('/api/checkout', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.paymentScreenshot = req.file.path;

    if (typeof data.items === 'string') {
      try { data.items = JSON.parse(data.items); } catch(e) {}
    }

    const newOrder = await Order.create(data);
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder.id });
  } catch (err) {
    console.error("⚠️ MySQL Error. Falling back to local JSON:", err.message);
    saveToLocal('orders.json', req.body);
    res.status(201).json({ message: 'Order placed locally (DB Offline)' });
  }
});

// 3. Admin: Get all Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    const localOrders = getFromLocal('orders.json');
    res.json([...localOrders, ...orders]);
  } catch (err) {
    res.json(getFromLocal('orders.json'));
  }
});

// Get Single Order Status
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const localOrders = getFromLocal('orders.json');
    const local = localOrders.find(o => o.id.toString() === id.toString());
    if (local) return res.json(local);

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) { res.status(400).json({ error: "Invalid Order ID" }); }
});

// 4. Admin: Get all Custom Requests
app.get('/api/custom-requests', async (req, res) => {
  try {
    const requests = await CustomRequest.findAll({ order: [['createdAt', 'DESC']] });
    const localRequests = getFromLocal('requests.json');
    res.json([...localRequests, ...requests]);
  } catch (err) {
    res.json(getFromLocal('requests.json'));
  }
});

// Update Order
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const localOrder = updateLocal('orders.json', id, req.body);
    if (localOrder) return res.json(localOrder);

    await Order.update(req.body, { where: { id } });
    const updated = await Order.findByPk(id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Custom Request
app.patch('/api/custom-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const localReq = updateLocal('requests.json', id, req.body);
    if (localReq) return res.json(localReq);

    await CustomRequest.update(req.body, { where: { id } });
    const updated = await CustomRequest.findByPk(id);
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete Custom Request
app.delete('/api/custom-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(__dirname, 'backups', 'requests.json');
    if (fs.existsSync(filePath)) {
      let existing = JSON.parse(fs.readFileSync(filePath));
      const filtered = existing.filter(item => item.id.toString() !== id.toString());
      if (filtered.length !== existing.length) {
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
        return res.json({ message: "Deleted from local storage" });
      }
    }

    await CustomRequest.destroy({ where: { id } });
    res.json({ message: "Request rejected and deleted" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 6. Products
app.post('/api/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, price, tag, size } = req.body;
    const imageUrl = req.files['image'] ? req.files['image'][0].path : null;
    const videoUrl = req.files['video'] ? req.files['video'][0].path : null;

    if (!imageUrl) return res.status(400).json({ error: "Image is required" });

    const newProduct = await Product.create({ name, price, tag, size, image: imageUrl, video: videoUrl });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (err) {
    res.json([]);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.files) {
      if (req.files['image']) updateData.image = req.files['image'][0].path;
      if (req.files['video']) updateData.video = req.files['video'][0].path;
    }
    await Product.update(updateData, { where: { id: req.params.id } });
    const updated = await Product.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Settings
app.get('/api/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Settings.findByPk(key);
    
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
    res.json({ key: setting.key, value: JSON.parse(setting.value) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const [setting] = await Settings.upsert({ key, value: JSON.stringify(value) });
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('Artsy Donut MySQL Backend is running!'));

app.listen(PORT, () => console.log(`🚀 MySQL Server is running on port ${PORT}`));
