import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css'; // Ensure the CSS file path is correct

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Supercharge Your Business Operations</h1>
        <p>Integrate and manage your business processes with our advanced ERP & CRM solutions tailored for your growing business needs.</p>
        <div className="home-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      <div className="home-image">
        <img src="https://www.deskera.com/blog/content/images/2021/02/ERP-vs-CRM-min-1.jpg" alt="ERP CRM Overview" />
      </div>
    </div>
  );
}

export default HomePage;
