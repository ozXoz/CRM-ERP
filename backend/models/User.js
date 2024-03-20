const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: {
    type: String,
    required: true,
    enum: ['Owner', 'Admin', 'Trial', 'User'], // Specify the allowed roles
    default: 'Trial'
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  subscriptionType: {
    type: String,
    enum: ['Starter', 'Premium', 'Enterprise', null],
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
