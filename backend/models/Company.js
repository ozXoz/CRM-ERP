const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model to know which admin created the company
    required: true
  },
  website: {
    type: String
  }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
