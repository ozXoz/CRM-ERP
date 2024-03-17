import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Our Application</h1>
      <p>This is the home page of our application. Get started by signing up or logging in.</p>
      <div>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default HomePage;
