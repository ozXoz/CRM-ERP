// models/People.js

const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  country: String,
  phone: String,
  email: { type: String, required: true },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming the User model has the admins
    required: true
  }
});

module.exports = mongoose.model('People', peopleSchema);
