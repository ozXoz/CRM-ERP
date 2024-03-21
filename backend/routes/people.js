// routes/people.js

const express = require("express");
const People = require("../models/People"); // Assuming your People model is in the models directory
const {
  authenticateToken,
  isAdminOrOwnerOrUser,
} = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new person
router.post("/", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const personData = {
      ...req.body,
      createdByAdmin: req.user.userId, // Assuming this is where you store the authenticated user's ID
    };
    const person = new People(personData);
    await person.save();
    res.status(201).send(person);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all people
router.get("/", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const people = await People.find({ createdByAdmin: req.user.userId });
    res.status(200).send(people);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a person
router.patch(
  "/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    try {
      const update = req.body;
      const adminId = req.user.userId; // Assuming this is set by your authentication middleware
      const personId = req.params.id;

      const person = await People.findOneAndUpdate(
        { _id: personId, createdByAdmin: adminId }, // Ensure the person was created by the admin
        update,
        { new: true }
      );

      if (!person) {
        // If no person was found with the ID and createdByAdmin criteria, it means either the person doesn't exist
        // or the admin doesn't have permission to update it.
        return res.status(404).send("Person not found or you do not have permission to update this record.");
      }

      res.send(person);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);


// Delete a person
router.delete(
  "/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    const adminId = req.user.userId; // Assuming this is set by your authentication middleware
    const personId = req.params.id;

    try {
      // Use findOneAndDelete to ensure that the document to be deleted is also owned by the admin
      const person = await People.findOneAndDelete({
        _id: personId,
        createdByAdmin: adminId // Check that the person was created by the admin
      });

      if (!person) {
        // If no person was found, or it was not created by the admin
        return res.status(404).send("Person not found or you do not have permission to delete this record.");
      }

      res.send({ message: "Person deleted successfully", person });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);


module.exports = router;
