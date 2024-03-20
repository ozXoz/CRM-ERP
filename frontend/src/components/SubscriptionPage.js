import React, { useEffect,useState } from "react";
import Sidebar from "./Sidebar";
import "../css/SubscriptionPage.css";
import "../css/SharedLayout.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios here

function SubscriptionPage() {
  const navigate = useNavigate();

  // This should be replaced with the actual logic to retrieve the authenticated user's ID
  const currentUserId = localStorage.getItem("userId") || "placeholderUserId";

  useEffect(() => {
    if (currentUserId === "placeholderUserId") {
      console.error("Invalid user ID. Ensure the user is logged in.");
      navigate("/login");
    }
  }, [currentUserId, navigate]);
  const [selectedPlan, setSelectedPlan] = useState(null); // State to track the selected plan for upgrade

  const plans = [
    {
      name: "Free",
      priceId: "price_freePlan", // Use the Stripe Price ID for the Free plan
      description: "Free for 10 min",
      features: [
        "Manage Invoices / Quotes",
        "Manage Company & People",
        "Manage Quotes & Leads",
        "Manage Expenses",
      ],
      buttonColor: "#00A8FF",
    },
    {
      name: "Starter",
      priceId: "price_1OvoXOBm4TSYA4w3CE1SiGIu", // Use the Stripe Price ID for the Starter plan
      description: "$24 / month - Include 3 Users",
      features: [
        "Manage Invoices / Quotes",
        "Manage Company & People",
        "Manage Quotes & Leads",
        "Manage Expenses",
        "24/7 priority support",
      ],
      buttonColor: "#00A8FF",
    },
    {
      name: "Premium",
      priceId: "price_1OvoclBm4TSYA4w37j1H05z8", // Use the Stripe Price ID for the Premium plan
      description: "$76 / month - Include 7 Users",
      features: [
        "Multi-Currency Support",
        "Manage Invoices / Quotes",
        "Manage Company & People",
        "Manage Quotes & Leads",
        "Manage Expenses",
        "24/7 priority support",
      ],
      buttonColor: "#9C88FF",
    },
    {
      name: "Enterprise",
      priceId: "price_1Ovod0Bm4TSYA4w3qU9towGx", // Use the Stripe Price ID for the Enterprise plan
      description: "$132 / month - Include 10 Users",
      features: [
        "Multi-Currency Support",
        "Multi-Branch Support",
        "Manage Invoices / Quotes",
        "Manage Company & People",
        "Manage Quotes & Leads",
        "Manage Expenses",
        "24/7 priority support",
      ],
      buttonColor: "#FBC531",
    },
  ];

  const handlePlanSelect = (plan) => {
    console.log("Navigating with:", plan.priceId, currentUserId); // Debugging statement
    navigate("/payment", {
      state: {
        planPriceId: plan.priceId,
        userId: currentUserId,
        subscriptionType: plan.name,
      },
    });
  };
  const cancelSubscription = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("http://localhost:3001/api/subscriptions/cancel", { userId: currentUserId }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      alert("Subscription cancelled successfully.");
      // Optionally, navigate the user or refresh subscription data here
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert("Failed to cancel the subscription. Please try again.");
    }
  };
  
  const upgradeSubscription = async (newPriceId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("http://localhost:3001/api/subscriptions/upgrade", {
        userId: currentUserId,
        newPriceId: newPriceId,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      alert("Subscription upgraded successfully.");
      // Optionally, navigate the user or refresh subscription data here
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
      alert("Failed to upgrade the subscription. Please try again.");
    }
  };
  

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Pricing</h1>
        <button onClick={cancelSubscription}>Cancel Subscription</button>
        {plans.map(plan => (
          <button key={plan.priceId} onClick={() => upgradeSubscription(plan.priceId)}>Upgrade to {plan.name}</button>
        ))}
        <div className="billing-toggle">
          <button className="billing-button active">Monthly Billing</button>
          <button className="billing-button">Yearly Billing -25%</button>
        </div>
        <div className="plans-container">
          {plans.map((plan) => (
            <div
              className="plan"
              key={plan.id}
              onClick={() => handlePlanSelect(plan)}
              style={{ cursor: "pointer" }}
            >
              <h2>{plan.name}</h2>
              <p className="price">{plan.price}</p>
              <p>{plan.description}</p>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button style={{ backgroundColor: plan.buttonColor }}>
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
