const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  tag: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String }, // Optional video field
  size: { type: String }, // New size field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
