// PeoplePage.js
import React from 'react';
import '../css/SharedLayout.css'; // Import the shared layout styles
import Sidebar from './Sidebar';


function ProductPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">

      <h1> ProductPage</h1>
      <p>Manage your ProductPage here.</p>
      {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default ProductPage;
