// DashboardPage.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../css/DashboardPage.css"; // Ensure the path to your CSS file is correct

function DashboardPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect user to login page
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>
            {/* CSS-based Profile icon */}
            <div className="profile-icon"></div>
            {showDropdown && (
              <div className="profile-dropdown">
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
}

export default DashboardPage;
