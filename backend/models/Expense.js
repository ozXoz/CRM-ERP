// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseCategory',
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['EUR', 'USD'] // Add more currencies as needed
  },
  total: {
    type: Number,
    required: true
  },
  description: String,
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
