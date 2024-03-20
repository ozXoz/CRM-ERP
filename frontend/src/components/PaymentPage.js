import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Sidebar from "./Sidebar";
import axios from "axios";
import "../css/PaymentPage.css";
import "../css/SharedLayout.css";

function PaymentPage() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting planPriceId and userId from location state
  const { planPriceId, userId, subscriptionType } = location.state || {};

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    console.log("Payment page state:", location.state); // Log the state for debugging
    // Redirect to subscriptions page if planPriceId or userId is missing
    if (!planPriceId || !userId) {
      navigate("/subscriptions");
    }
  }, [planPriceId, userId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded
    }
  
    setProcessing(true);
    const cardElement = elements.getElement(CardElement);
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
  
    if (error) {
      console.log("Error:", error);
      setError(error.message);
      setProcessing(false);
    } else {
      try {
        const subscriptionResponse = await axios.post("http://localhost:3001/api/subscriptions/create", {
          paymentMethodId: paymentMethod.id,
          priceId: planPriceId,
          userId: userId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        // Use the extracted subscriptionType
        await axios.patch(`http://localhost:3001/api/subscriptions/update-subscription-type/${userId}`, {
          subscriptionType: subscriptionType,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        navigate("/success");
      } catch (error) {
        setError("Payment failed: " + error.message);
        setProcessing(false);
      }
    }
  };
  

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Complete Your Payment</h1>
        <form onSubmit={handleSubmit} className="payment-form">
          <CardElement />
          <button type="submit" disabled={processing || !stripe || !elements}>
            {processing ? "Processing…" : "Pay Now"}
          </button>
          {error && <div className="payment-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
