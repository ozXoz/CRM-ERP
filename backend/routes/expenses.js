// routes/expenses.js
const express = require('express');
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');
const router = express.Router();

// POST - Create a new Expense
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { name, category, currency, total, description } = req.body;
    const newExpense = new Expense({
      name,
      category,
      currency,
      total,
      description,
      createdByAdmin: req.user.userId
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET - Fetch all Expenses created by the admin
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ createdByAdmin: req.user.userId }).populate('category');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Update an existing Expense
router.patch('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
      const updatedExpense = await Expense.findOneAndUpdate(
          { _id: req.params.id, createdByAdmin: req.user.userId },
          req.body,
          { new: true }
      ).populate('category');

      if (!updatedExpense) {
          return res.status(404).send("Expense not found or you don't have permission to update this expense.");
      }

      res.json(updatedExpense);
  } catch (error) {
      res.status(400).send(error.message);
  }
});

// Delete an existing Expense
router.delete('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
      const deletedExpense = await Expense.findOneAndDelete({
          _id: req.params.id,
          createdByAdmin: req.user.userId
      });

      if (!deletedExpense) {
          return res.status(404).send("Expense not found or you don't have permission to delete this expense.");
      }

      res.json({ message: 'Expense successfully deleted', deletedExpense });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// Additional routes for updating and deleting expenses can follow a similar pattern

module.exports = router;
