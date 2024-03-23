const express = require("express");
const ProductCategory = require("../models/ProductCategory");
const { authenticateToken, isAdminOrOwnerOrUser } = require("../middleware/authMiddleware");

const router = express.Router();

// POST - Add a new Product Category
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { name, description, note } = req.body;
    const newCategory = new ProductCategory({
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

// GET - Fetch all Product Categories
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const categories = await ProductCategory.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET - Fetch a single Product Category by ID
router.get('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Product category not found');
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PATCH - Update a Product Category
router.patch("/:id", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const update = req.body;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!updatedCategory) {
      return res.status(404).send("Product category not found or you do not have permission to update this record.");
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE - Delete a Product Category
router.delete("/:id", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const deletedCategory = await ProductCategory.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).send("Product category not found or you do not have permission to delete this record.");
    }

    res.status(200).json({ message: "Product category deleted successfully", deletedCategory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
