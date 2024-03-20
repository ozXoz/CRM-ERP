const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.post('/', bodyParser.raw({ type: 'application/json' }), webhookController.handleStripeEvent);

module.exports = router;
