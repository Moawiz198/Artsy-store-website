const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
  instagram: { type: String },
  surah: { type: String },
  size: { type: String },
  colors: { type: String },
  requirements: { type: String, required: true },
  image: { type: String }, // New field for reference image
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);
