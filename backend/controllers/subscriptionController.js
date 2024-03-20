const stripe = require("../config/stripe");
const Subscription = require("../models/Subscription");
const User = require("../models/User"); // Your User model
const mongoose = require("mongoose"); // Add this line to import mongoose

exports.createSubscription = async (req, res) => {
  console.log(req.body);
  const { userId, priceId, paymentMethodId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid userId format");
  }

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send("User not found");
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
          const customer = await stripe.customers.create({
              email: user.email,
              payment_method: paymentMethodId,
              invoice_settings: { default_payment_method: paymentMethodId },
          });
          customerId = customer.id;
          user.stripeCustomerId = customerId; // Update user with Stripe customer ID directly
      } else {
          await stripe.paymentMethods.attach(paymentMethodId, {
              customer: customerId,
          });
          await stripe.customers.update(customerId, {
              invoice_settings: { default_payment_method: paymentMethodId },
          });
      }

      const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
      });

      const newSubscription = new Subscription({
          userId: user._id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          plan: subscription.items.data[0].price.id,
          status: subscription.status,
      });
      await newSubscription.save();
      console.log("New Subscription saved:", newSubscription);

      user.subscription = newSubscription._id; // Crucially link the new subscription ID to the user

      // Check if the user is not already an Admin and update their role
      if (user.role !== 'Admin') {
          user.role = 'Admin';
          await user.save();
          console.log(`User role updated to Admin for user ID: ${user._id}`);
      }

      res.status(201).json({
          subscription: subscription,
          message: "Subscription created and linked to the user.",
      });
  } catch (error) {
      console.error("Create Subscription Error:", error.message);
      res.status(500).send("Error creating subscription: " + error.message);
  }
};


exports.updateSubscriptionType = async (req, res) => {
  const { userId } = req.params;
  const { subscriptionType } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Updating the user's subscription type
    user.subscriptionType = subscriptionType;
    await user.save();

    res.json({ message: "Subscription type updated successfully", user: user });
  } catch (error) {
    console.error("Update Subscription Type Error:", error);
    res.status(500).send("Error updating subscription type: " + error.message);
  }
};

exports.cancelSubscription = async (req, res) => {
  const { userId } = req.body;

  try {
    const subscription = await Subscription.findOne({ userId: userId });
    if (!subscription) return res.status(404).send("Subscription not found");

    // Cancel subscription with Stripe
    const canceledSubscription = await stripe.subscriptions.del(
      subscription.stripeSubscriptionId
    );

    // Update subscription status in your DB
    await Subscription.findByIdAndUpdate(subscription._id, {
      status: "canceled", // or canceledSubscription.status if you prefer
    });

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    res.status(500).send("Server Error");
  }
};
