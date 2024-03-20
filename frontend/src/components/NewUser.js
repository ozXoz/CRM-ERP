import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../service/auth";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify"; // Make sure this line is added
import "react-toastify/dist/ReactToastify.css";
import "../css/SharedLayout.css";
import "../css/NewUer.css";

// Define your API endpoints
const CREATE_USER_ENDPOINT = "http://localhost:3001/admin/create-user";
const GET_USERS_ENDPOINT = "http://localhost:3001/admin/users";
const UPDATE_USER_ENDPOINT = "http://localhost:3001/admin/update-user/"; // Append user ID when making request
const DELETE_USER_ENDPOINT = "http://localhost:3001/admin/delete-user/"; // Append user ID when making request

function NewUser() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = getToken();
    try {
      const response = await axios.get(GET_USERS_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      console.log("Fetched users:", response.data); // Log fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    let endpoint = editingUserId
      ? `${UPDATE_USER_ENDPOINT}${editingUserId}`
      : CREATE_USER_ENDPOINT;

    // Use 'post' method for creation and 'patch' for updating
    let axiosMethod = editingUserId ? axios.patch : axios.post;

    // Prepare the data for submission. If editing, exclude the password.
    let submissionData = editingUserId
      ? {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        }
      : formData;

    try {
      await axiosMethod(endpoint, submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUsers();
      toast.success("User created/updated successfully!");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error
      );
      toast.error(`Error: ${error.response ? error.response.data : "An error occurred"}`);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      // It's a good practice not to handle passwords in client-side code for edit operations
      password: "",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleDelete = async (userId) => {
    const token = getToken();
    try {
      await axios.delete(`${DELETE_USER_ENDPOINT}${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    setEditingUserId(null); // Clear editing user ID
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h2>{editingUserId ? "Edit User" : "Create New User"}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <button type="submit" className="submit-btn">
            {editingUserId ? "Update User" : "Create User"}
          </button>
        </form>

        <h2>User List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default NewUser;
