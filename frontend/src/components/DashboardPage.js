import React from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../css/DashboardPage.css'; // If you have separate CSS for the DashboardPage

function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}

export default DashboardPage;
