import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css"; // Make sure the path to your CSS file is correct
import Footer from "./Footer";
function HomePage() {
  const customerReviews = [
    { name: "Alice", quote: "Amazing service! Highly recommend.", rating: 5 },
    { name: "Bob", quote: "Excellent support and great value.", rating: 4 },
    {
      name: "Charlie",
      quote: "Truly innovative solutions for any business.",
      rating: 5,
    },
    // ... you can add more reviews here
  ];
  const pricingTiers = [
    {
      name: "Starter",
      price: "$25",
      features: [
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
      ],
    },
    {
      name: "Premium",
      price: "$65",
      features: [
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
      ],
    },
    {
      name: "Enterprise",
      price: "$199",
      features: [
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
        "Lorem ipsum dolor sit nisi",
      ],
    },
  ];

  // Define the features you want to include on the home page
  const features = [
    {
      title: "Be Productive",
      description:
        "Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.",
      image: "https://i.ibb.co/D4bDSQp/p1.png",
    },
    {
      title: "Be Productive",
      description:
        "Nam at lectus urna duis convallis. Mauris rhoncus aenean vel elit scelerisque mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.",
      image: "https://i.ibb.co/PjgmGP8/p2.png",
    },
    {
      title: "Be Productive",
      description:
        "Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris.Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. A arcu cursus vitae congue mauris. at augue.",
      image: "https://i.ibb.co/P6MrTy2/p3.png",
    },
  ];

  return (
    <div className="new-home-container">
      {/* Main content */}
      <div className="new-home-content">
        <h1>Revolutionize Your Workflow</h1>
        <p>
          Discover unparalleled efficiency with our next-gen ERP & CRM
          solutions. Elevate your business to new heights today.
        </p>
        <div className="new-home-buttons">
          <Link to="/signup" className="btn btn-primary">
            Begin Your Journey
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Enter the Realm
          </Link>
        </div>
      </div>
      <div className="new-home-image">
        <img
          src="https://yourimageurl.com/new-image.jpg"
          alt="Innovative Solutions"
        />
      </div>
      {/* Feature section */}
      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-item" key={index}>
            <div
              className="feature-image"
              style={{ backgroundImage: `url(${feature.image})` }}
            ></div>
            <h2 className="feature-title">{feature.title}</h2>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
      {/* Pricing section */}
      <div className="pricing-container">
        {pricingTiers.map((tier, index) => (
          <div className="pricing-item" key={index}>
            <h2>{tier.name}</h2>
            <p className="pricing-price">
              {tier.price}
              <span>/month</span>
            </p>
            <p>What you will get</p>
            <ul className="pricing-features">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <Link to="/login" className="btn btn-primary">
              Pre Order Now
            </Link>
          </div>
        ))}
      </div>
      {/* Customer review section */}
      <div className="review-section">
        {customerReviews.map((review, index) => (
          <div className="review-item" key={index}>
            <blockquote className="review-quote">"{review.quote}"</blockquote>
            <p className="review-name">- {review.name}</p>
            <div className="review-rating">{"★".repeat(review.rating)}</div>
          </div>
        ))}
      </div>
      <Footer />

      {/* Footer would go here */}
    </div>
  );
}

export default HomePage;
