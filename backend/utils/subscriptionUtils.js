// utils/subscriptionUtils.js

const mapPriceIdToSubscriptionType = (priceId) => {
    const priceIdMap = {
      'price_1OvoXOBm4TSYA4w3CE1SiGIu': 'Starter',
      'price_1OvoclBm4TSYA4w37j1H05z8': 'Premium',
      'price_1Ovod0Bm4TSYA4w3qU9towGx': 'Enterprise'
    };
    return priceIdMap[priceId] || null;
  };
  
  module.exports = { mapPriceIdToSubscriptionType };
  