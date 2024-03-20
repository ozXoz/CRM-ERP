const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is in the models directory
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Import authenticateToken and isAdmin middleware functions

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create a new user with the hashed password and other details
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      role: 'Trial' // Set the default role to 'Trial'
    });

    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Login route
// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`User logged in: email - ${user.email}, ID - ${user._id}, role - ${user.role}`);

    // Include userId in the response
    res.json({ token, userId: user._id.toString(), role: user.role });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// In your authRoutes.js file or wherever you define your authentication-related routes

router.post('/logout', function(req, res) {
  // Optionally add the token to a blacklist or log the logout action
  // Since JWTs are stateless, there's no need to clear the token server-side for the basic logout functionality
  
  // You could log the user out here or invalidate a refresh token if applicable
  console.log('User logged out');
  
  // Send a response indicating logout was successful
  res.status(200).json({ message: 'Logout successful' });
});








module.exports = router;
