import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css"; // Ensure the path to your CSS file is correct

const API_ENDPOINT = "http://localhost:3001";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data); // This helps ensure we're getting the right data
      // Notice the change here to 'role' to match your actual response structure
      const { token, userId, role } = response.data;
  
      // Store the response data in localStorage using the correct keys
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", role); // Note the change to 'role' here
  
      navigate("/dashboard"); // Navigate without URL parameters
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error);
    }
  };
  


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-control">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
