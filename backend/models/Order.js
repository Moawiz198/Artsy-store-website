const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    tag: String
  }],
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  isFullPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Pending Payment' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
