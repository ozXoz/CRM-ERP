// routes/expenseCategories.js
const express = require('express');
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const ExpenseCategory = require('../models/ExpenseCategory');
const router = express.Router();

// POST - Create a new Expense Category
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { name, description, note } = req.body;
    const newCategory = new ExpenseCategory({
      name,
      description,
      note,
      createdByAdmin: req.user.userId
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET - Fetch all Expense Categories created by the admin
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ createdByAdmin: req.user.userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Additional routes for updating and deleting categories can follow a similar pattern

module.exports = router;
