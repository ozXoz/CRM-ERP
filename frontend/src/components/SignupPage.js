import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SignupPage.css'; // Ensure the path to your CSS file is correct

const API_ENDPOINT = 'http://localhost:3001';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_ENDPOINT}/auth/signup`, formData);
      navigate('/login'); // Use navigate for redirection
    } catch (error) {
      console.error("Signup error:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <button type="submit" className="signup-button">Signup</button>
      </form>
    </div>
  );
}

export default SignupPage;
