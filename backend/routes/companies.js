const express = require("express");
const Company = require("../models/Company"); // Your Company model path
const {
  authenticateToken,
  isAdminOrOwnerOrUser,
} = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new company
router.post("/", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdByAdmin: req.user.userId, // Include the ID of the admin creating the company
    };
    const company = new Company(companyData);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all companies
router.get("/", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
    // Extract the ID and role of the currently authenticated user from the request
    const { userId, role } = req.user; // This assumes your authentication middleware adds 'user' to 'req'

    // Initialize the query. By default, it will fetch all companies for 'Owner' role,
    // or only those created by the logged-in 'Admin'.
    let query = {};
    
    // If the user's role is not 'Owner', adjust the query to filter by 'createdByAdmin'.
    // This ensures that 'Admin' users can only see their own companies.
    // Adapt this logic based on your specific role and access control requirements.
    if (role !== 'Owner') {
      query.createdByAdmin = userId;
    }

    const companies = await Company.find(query);

    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Update a company
router.patch(
  "/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    const { userId, role } = req.user; // Extract user details from the authentication middleware

    try {
      let query = { _id: req.params.id };
      // For roles other than 'Owner', ensure the company was created by the admin
      if (role !== 'Owner') {
        query.createdByAdmin = userId;
      }

      const company = await Company.findOneAndUpdate(query, req.body, {
        new: true,
      });

      if (!company) {
        // No company found, or the user doesn't have permission to update it
        return res.status(404).send("Company not found or you do not have permission to update this record.");
      }

      res.send(company);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);


// Delete a company
router.delete(
  "/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    const { userId, role } = req.user; // Extract user details from the authentication middleware

    try {
      let query = { _id: req.params.id };
      // For roles other than 'Owner', ensure the company was created by the admin
      if (role !== 'Owner') {
        query.createdByAdmin = userId;
      }

      // Attempt to find and delete the company based on the constructed query
      const company = await Company.findOneAndDelete(query);

      if (!company) {
        // If no company was found with the given criteria, it either doesn't exist
        // or the user doesn't have permission to delete it
        return res.status(404).send("Company not found or you do not have permission to delete this record.");
      }

      res.send({ message: "Company deleted successfully", company });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);


module.exports = router;
