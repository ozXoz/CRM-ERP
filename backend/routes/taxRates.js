const express = require('express');
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const TaxRate = require('../models/TaxRate');
const router = express.Router();

// POST - Create a new Tax Rate
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const { country, province, totalTaxRate } = req.body;
    const newTaxRate = new TaxRate({
      country,
      province,
      totalTaxRate,
      createdByAdmin: req.user.userId // using the authenticated user's ID
    });
    await newTaxRate.save();
    res.status(201).json(newTaxRate);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET - Fetch all Tax Rates created by the admin
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const taxRates = await TaxRate.find({ createdByAdmin: req.user.userId });
    res.status(200).json(taxRates);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// GET - Fetch a single Tax Rate by ID
router.get('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
    try {
      const taxRate = await TaxRate.findOne({ _id: req.params.id, createdByAdmin: req.user.userId });
      if (!taxRate) {
        return res.status(404).send('Tax rate not found');
      }
      res.status(200).json(taxRate);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // PATCH - Update an existing Tax Rate
  router.patch('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
    try {
      const { country, province, totalTaxRate } = req.body;
      const taxRate = await TaxRate.findOneAndUpdate(
        { _id: req.params.id, createdByAdmin: req.user.userId },
        { country, province, totalTaxRate },
        { new: true }
      );
      if (!taxRate) {
        return res.status(404).send('Tax rate not found or not authorized to update');
      }
      res.status(200).json(taxRate);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  // DELETE - Delete an existing Tax Rate
  router.delete('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
    try {
      const taxRate = await TaxRate.findOneAndDelete({ _id: req.params.id, createdByAdmin: req.user.userId });
      if (!taxRate) {
        return res.status(404).send('Tax rate not found or not authorized to delete');
      }
      res.status(200).json({ message: 'Tax rate successfully deleted', taxRate });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
// Additional routes for updating and deleting can be added here

module.exports = router;
