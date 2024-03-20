const express = require('express');
const Company = require('../models/Company'); // Your Company model path
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new company
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all companies
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a company
router.patch('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).send();
    }
    res.send(company);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a company
router.delete('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send();
    }
    res.send(company);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
