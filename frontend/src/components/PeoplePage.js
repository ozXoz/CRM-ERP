// PeoplePage.js
import React from 'react';
import Sidebar from './Sidebar';
import '../css/SharedLayout.css'; // Import the shared layout styles


function PeoplePage() {
  return (
<div className="layout">
  <Sidebar />
  <div className="main-content">
      <h1>People</h1>
      <p>Manage your people here.</p>
      {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default PeoplePage;
