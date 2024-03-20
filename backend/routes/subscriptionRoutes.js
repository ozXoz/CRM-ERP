const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create", subscriptionController.createSubscription);
router.patch(
  "/update-subscription-type/:userId",
  authenticateToken,
  subscriptionController.updateSubscriptionType
);
router.post(
  "/cancel",
  authenticateToken,
  subscriptionController.cancelSubscription
);

router.patch(
    "/update-subscription-type/:userId",
    authenticateToken,
    subscriptionController.updateSubscriptionType
  );
 
  
  

// Add the new route for updating the subscription type
module.exports = router;
