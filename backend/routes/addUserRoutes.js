const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const User = require("../models/User"); // Adjust the path according to your project structure
const Subscription = require("../models/Subscription");
const { mapPriceIdToSubscriptionType } = require("../utils/subscriptionUtils");
const router = express.Router();
const checkSubscriptionLimit = require("../middleware/checkSubscriptionLimit");
const {
  authenticateToken,
  isAdminOrOwnerOrUser,
  // Apply the middleware here
} = require("../middleware/authMiddleware");

// Route to create a new user by an admin
router.post(
  "/create-user",
  authenticateToken,
  isAdminOrOwnerOrUser,
  checkSubscriptionLimit,
  async (req, res) => {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;

    try {
      const admin = await User.findById(req.user.userId);
      if (!admin) return res.status(404).send("Admin not found");

      let adminSubscription = await Subscription.findOne({ userId: admin._id });
      if (!adminSubscription) {
        return res.status(404).send("Admin subscription not found. Please set up your subscription.");
      }

      // Use the utility function to map the Stripe price ID to a subscription type
      const subscriptionType = mapPriceIdToSubscriptionType(adminSubscription.plan);

      if (!subscriptionType) {
        return res.status(400).send("Invalid subscription plan. Please contact support.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: "User",
        createdByAdmin: admin._id,
        subscriptionType // Set using the mapped value
      });

      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Error creating user");
    }
  }
);


// Route for Admin/Owner to view all users created by Admins
router.get(
  "/users",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    try {
      const users = await User.find({}).populate("subscription"); // Populate the 'subscription' field
      res.json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Route for Admin/Owner to update a user created by Admins
router.patch(
  "/update-user/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "username",
      "email",
      "firstName",
      "lastName",
      "phoneNumber",
    ]; // Specify which fields can be updated
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      const user = await User.findOne({
        _id: req.params.id,
        // createdByAdmin: req.user.userId,
      });

      if (!user) {
        return res.status(404).send();
      }

      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();

      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

// Route for Admin/Owner to delete a user created by Admins
router.delete(
  "/delete-user/:id",
  authenticateToken,
  isAdminOrOwnerOrUser,
  async (req, res) => {
    try {
      const user = await User.findOneAndDelete({
        _id: req.params.id,
        // createdByAdmin: req.user.userId,
      });

      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    } catch (error) {
      res.status(500).send();
    }
  }
);

module.exports = router;
