const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  productCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  taxRate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxRate',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  subtotal: Number,
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  expireDate: Date,
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR']
  },
  quantity: {
    type: Number,
    required: true
  },
  note: String,
  description: String,
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
