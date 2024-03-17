// PeoplePage.js
import React from 'react';
import Sidebar from './Sidebar';
import '../css/SharedLayout.css'; // Import the shared layout styles


function InvoicePage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
      <h1> InvoicePage</h1>
      <p>Manage your InvoicePage here.</p>
      {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default InvoicePage;
