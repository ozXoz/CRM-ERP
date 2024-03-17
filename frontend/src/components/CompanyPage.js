// PeoplePage.js
import React from 'react';
import '../css/SharedLayout.css'; // Import the shared layout styles
import Sidebar from './Sidebar';
import '../css/SharedLayout.css'; // Import the shared layout styles




function CompanyPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
      <h1> CompanyPage</h1>
      <p>Manage your CompanyPage here.</p>
      {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default CompanyPage;
