import React from "react";
import "../css/SubscriptionPage.css";
import Sidebar from "./Sidebar";
import '../css/SharedLayout.css'; // Import the shared layout styles

function SubscriptionPage() {
  const plans = [
    {
      name: "Free",
      price: "$0 / month",
      description: "Free for  10 min",
      features: [
        "Manage Invoices / Quotes",
        "Manage Company & People",
        "Manage Quotes & Leads",
        "Manage Expenses",
      ],
      buttonColor: "#00A8FF", // Use HEX color codes for consistency
    },
    {
      name: "Starter",
      price: "$24 / month",
      description: "Include 3 Users",
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
      price: "$76 / month",
      description: "Include 7 Users",
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
      price: "$132 / month",
      description: "Include 10 Users",
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

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Pricing</h1>
        <div className="billing-toggle">
          <button className="billing-button active">Monthly Billing</button>
          <button className="billing-button">Yearly Billing -25%</button>
        </div>
        <div className="plans-container">
          {plans.map((plan) => (
            <div className="plan" key={plan.name}>
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <p className="price">{plan.price}</p>
                <p className="plan-description">{plan.description}</p>
              </div>
              <ul className="features-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                className="get-started"
                style={{ backgroundColor: plan.buttonColor }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
