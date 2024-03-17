const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Trial', 'Premium', 'Standard', 'Enterprise'],
    default: 'Trial'
  },
  features: [String] // Simple representation of features as an array of strings
  // For a more complex feature set, consider defining a separate schema
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
