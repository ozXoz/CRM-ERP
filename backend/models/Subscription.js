const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  plan: String, // This could be 'monthly' or 'yearly', depending on your plans
  status: String, // For example, 'active', 'canceled', 'past_due', etc.
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
