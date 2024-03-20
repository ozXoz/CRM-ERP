const jwt = require("jsonwebtoken");

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Store user information from token
    next();
  });
}

// Middleware to check if the authenticated user is an Owner or an Admin
function isAdminOrOwnerOrUser(req, res, next) {
  if (req.user.role !== "Owner" && req.user.role !== "Admin" && req.user.role !== "User") {
    return res.sendStatus(403); // User is neither an Owner nor an Admin
  }
  next();
}

module.exports = { authenticateToken, isAdminOrOwnerOrUser };
