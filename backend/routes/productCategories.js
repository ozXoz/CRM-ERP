const express = require('express');
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const ProductCategory = require('../models/ProductCategory');
const router = express.Router();

router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { name, description, note } = req.body;
    const newCategory = new ProductCategory({ name, description, note, createdByAdmin: req.user.userId });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const categories = await ProductCategory.find({ createdByAdmin: req.user.userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Include routes for updating and deleting as needed

module.exports = router;
