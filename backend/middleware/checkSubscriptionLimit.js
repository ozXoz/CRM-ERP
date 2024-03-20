const User = require('../models/User'); // Assuming your User model is in the models directory
const Subscription = require('../models/Subscription'); // Assuming your Subscription model is in the models directory
const { mapPriceIdToSubscriptionType } = require("../utils/subscriptionUtils");

const userLimits = {
  'Starter': 3,
  'Premium': 7,
  'Enterprise': 10
};


async function checkSubscriptionLimit(req, res, next) {
    try {
        // Fetch the admin user from the database
        const admin = await User.findById(req.user.userId);
        if (!admin) {
            return res.status(404).send("Admin not found");
        }

        // Fetch the admin's subscription details
        const subscription = await Subscription.findOne({ userId: admin._id });
        if (!subscription) {
            return res.status(404).send("Subscription not found");
        }

        // Map the Stripe plan ID to your application's subscription type
        const subscriptionType = mapPriceIdToSubscriptionType(subscription.plan);
        if (!subscriptionType) {
            return res.status(404).send("Subscription type not found.");
        }

        // Retrieve the user limit for the determined subscription type
        const limit = userLimits[subscriptionType];

        // Count the number of users created by this admin
        const userCount = await User.countDocuments({ createdByAdmin: admin._id });

        // Compare against the allowed limit based on the admin's subscription type
        if (userCount >= limit) {
            return res.status(403).send(`User limit reached for your subscription plan (${subscriptionType}).`);
        }

        // If within limit, proceed to the next middleware or request handler
        next();
    } catch (error) {
        console.error("Error checking subscription limit:", error);
        res.status(500).send(error.message);
    }
}


module.exports = checkSubscriptionLimit;
