// utils/auth.js or services/auth.js

import axios from "axios";

// Function to get the token from localStorage or some secure storage
export const getToken = () => {
  return localStorage.getItem("token"); // Adjust this to how you store your token
};

// Function to set the Authorization header for Axios requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
