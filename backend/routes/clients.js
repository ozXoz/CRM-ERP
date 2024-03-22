// routes/clients.js
const express = require("express");
const router = express.Router();
const Client = require("../models/Client"); // Your Client model path
const People = require("../models/People"); // Your People model path
const Company = require("../models/Company"); // Your Company model path
const {
  authenticateToken,
  isAdminOrOwnerOrUser,
} = require("../middleware/authMiddleware");

// Create a new client
router.post("/add", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
    const { type, referenceId } = req.body;
    
    try {
        let refData;
        let name;
        
        if (type === "People") {
            refData = await People.findById(referenceId);
            if(refData) {
                // Combine firstName and lastName for People
                name = `${refData.firstName} ${refData.lastName}`;
            }
        } else if (type === "Company") {
            refData = await Company.findById(referenceId);
            if(refData) {
                // Use the name directly for Companies
                name = refData.name;
            }
        } else {
            return res.status(400).send("Invalid type specified");
        }

        if (!refData) {
            return res.status(404).send("Reference data not found");
        }

        const client = new Client({
            type,
            reference: referenceId,
            name: name,
            country: refData.country,
            phone: refData.phone,
            email: refData.email,
            createdByAdmin: req.user.userId,
        });

        await client.save();
        res.status(201).send(client);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

  

// Additional routes can be implemented similarly...
// GET endpoint to dynamically list People or Companies based on query parameter
router.get("/list", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  const { type } = req.query; // Expecting a query parameter ?type=People or ?type=Company

  // Debugging: Log the received query type and user ID for verification
  console.log('Received Type:', type);
  console.log('User ID:', req.user ? req.user.userId : 'User ID not available');

  try {
    let results = [];

    // Validate the 'type' query parameter
    if (!type || (type !== "People" && type !== "Company")) {
      return res.status(400).send({
        message: "Invalid type specified. Please choose either 'People' or 'Company'.",
      });
    }

    if (type === "People") {
      results = await People.find({ createdByAdmin: req.user.userId }).select("name country phone email");
    } else if (type === "Company") {
      results = await Company.find({ createdByAdmin: req.user.userId }).select("name country phone email");
      console.log("Sending Company data:", results); // Debug: log the data
    }

    // Debugging: Log the number of results fetched
    console.log(`${results.length} ${type} records found.`);

    // Check if any results were found
    if (results.length === 0) {
      return res.status(404).send({ message: `No ${type} records found for the current user.` });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data", error: error.message });
  }
});


// Fetch all clients
router.get("/", authenticateToken, isAdminOrOwnerOrUser, async (req, res) => {
  try {
      const clients = await Client.find({});
      res.status(200).json(clients);
  } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).send({ message: "Error fetching clients" });
  }
});




module.exports = router;
