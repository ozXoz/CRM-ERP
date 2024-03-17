// PeoplePage.js
import React from 'react';
import '../css/SharedLayout.css'; // Import the shared layout styles
import Sidebar from './Sidebar';
import '../css/SharedLayout.css'; // Import the shared layout styles



function ProductCategoryPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
      <h1> ProductCategoryPage</h1>
      <p>Manage your ProductCategoryPage here.</p>
      {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default ProductCategoryPage;
