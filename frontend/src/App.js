import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage"; // Adjust the path as necessary
import LoginPage from "./components/LoginPage"; // Adjust the path as necessary
import SignupPage from "./components/SignupPage"; // Adjust the path as necessary
import DashboardPage from "./components/DashboardPage"; // Adjust the path as necessary

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
          <Route path="/signup" element={<SignupPage />} /> {/* Signup Page */}
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Page after Login */}
          {/* Redirect to Home if no match found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
