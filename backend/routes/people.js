// routes/people.js

const express = require('express');
const People = require('../models/People'); // Assuming your People model is in the models directory
const { authenticateToken, isAdminOrOwnerOrUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new person
router.post('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const person = new People(req.body);
    await person.save();
    res.status(201).send(person);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all people
router.get('/', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const people = await People.find({});
    res.status(200).send(people);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a person
router.patch('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const person = await People.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) {
      return res.status(404).send();
    }
    res.send(person);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a person
router.delete('/:id', authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const person = await People.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).send();
    }
    res.send(person);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
