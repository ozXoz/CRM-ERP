const mongoose = require('mongoose');

const taxRateSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  totalTaxRate: {
    type: Number,
    required: true
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const TaxRate = mongoose.model('TaxRate', taxRateSchema);

module.exports = TaxRate;
