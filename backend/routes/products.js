const express = require('express');
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const router = express.Router();

router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { name, category, currency, price, description } = req.body;
    const newProduct = new Product({ name, category, currency, price, description, createdByAdmin: req.user.userId });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const products = await Product.find({ createdByAdmin: req.user.userId }).populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Include routes for updating and deleting as needed

module.exports = router;
