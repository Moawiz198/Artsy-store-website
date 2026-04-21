const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
  surah: { type: String },
  size: { type: String },
  colors: { type: String },
  requirements: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);
