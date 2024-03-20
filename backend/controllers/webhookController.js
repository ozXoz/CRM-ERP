const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');

exports.handleStripeEvent = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event (subscription updated, deleted, etc.)
  // Update your DB based on the event type

  res.json({ received: true });
};
