import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/CompanyPage.css"; // Ensure this path is correct
import { getToken } from "../service/auth";

const API_ENDPOINT = "http://localhost:3001/companies";

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getToken()}`, // Ensure the token is sent with every request
  },
});

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); // State to manage active dropdown
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    country: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/");
      setCompanies(response.data);
      // After fetching, initialize dropdownRefs for each company
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleAddClick = () => {
    setIsEditing(true);
    setSelectedCompany(null);
    setFormData({
      name: "",
      contact: "",
      country: "",
      phone: "",
      email: "",
      website: "",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const action = selectedCompany
        ? api.patch(`/${selectedCompany._id}`, formData)
        : api.post("/", formData);
      await action;
      setIsEditing(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditClick = (company) => {
    setIsEditing(true);
    setSelectedCompany(company);
    setFormData(company);
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedCompany(null);
    setFormData({
      name: "",
      contact: "",
      country: "",
      phone: "",
      email: "",
      website: "",
    });
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index); // Toggle dropdown visibility
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="main-header">
          <h1>Company Management</h1>
          <button className="add-button" onClick={handleAddClick}>
            Add New Company
          </button>
        </div>
        {isEditing && (
          <form onSubmit={handleFormSubmit} className="company-form">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Company Name"
            />
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleFormChange}
              placeholder="Primary Contact"
            />
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleFormChange}
              placeholder="Country"
            />
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Phone Number"
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email Address"
            />
            <label>Website:</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleFormChange}
              placeholder="Website URL"
            />
            <div className="form-actions">
              <button type="submit" className="submit-button">Save Company</button>
              <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
        <table className="company-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Country</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company._id}>
                <td>{company.name}</td>
                <td>{company.contact}</td>
                <td>{company.country}</td>
                <td>{company.phone}</td>
                <td>{company.email}</td>
                <td>{company.website}</td>
                <td>
                  <div className="relative-container">
                    <button className="action-button" onClick={() => toggleDropdown(index)}>...</button>
                    {activeDropdown === index && (
                      <div className="dropdown-content show">
                        <button onClick={() => handleEditClick(company)}>Edit</button>
                        <button onClick={() => handleDeleteClick(company._id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default CompanyPage;
