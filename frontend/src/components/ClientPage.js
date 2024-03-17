// PeoplePage.js
import React from "react";
import Sidebar from "../components/Sidebar";
import '../css/SharedLayout.css'; // Import the shared layout styles

function ClientPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Client PeoplePage</h1>
        <p>Manage your client here.</p>
        {/* Additional content for the People page */}
      </div>
    </div>
  );
}

export default ClientPage;
