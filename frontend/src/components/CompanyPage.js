import React, { useState, useEffect, useRef, createRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/CompanyPage.css";
import { getToken } from "../service/auth";

const API_ENDPOINT = "http://localhost:3001/companies";

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef([]);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current.every((ref) => ref && !ref.contains(event.target))) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/");
      setCompanies(response.data);
      dropdownRef.current = response.data.map((_, i) => dropdownRef.current[i] ?? createRef());
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const action = selectedCompany
        ? api.patch(`/${selectedCompany._id}`, formData)
        : api.post("/", formData);
      await action;
      setIsEditing(false);
      setSelectedCompany(null);
      setActiveDropdown(null);
      fetchCompanies();
      setFormData({
        name: "",
        contact: "",
        country: "",
        phone: "",
        email: "",
        website: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddClick = () => {
    setIsEditing(true);
    setSelectedCompany(null);
    setActiveDropdown(null);
    setFormData({
      name: "",
      contact: "",
      country: "",
      phone: "",
      email: "",
      website: "",
    });
  };

  const handleEditClick = (company) => {
    setIsEditing(true);
    setSelectedCompany(company);
    setFormData(company);
    setActiveDropdown(null);
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
    setActiveDropdown(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedCompany(null);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
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
                  <div className="action-buttons" ref={(el) => (dropdownRef.current[index] = el)}>
                    <div className="relative-container">
                      <button className="action-button" onClick={() => toggleDropdown(index)}>
                        ...
                      </button>
                      {activeDropdown === index && (
                        <div className="dropdown-content show">
                          <button onClick={() => handleEditClick(company)}>Edit</button>
                          <button onClick={() => handleDeleteClick(company._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(isEditing || selectedCompany) && (
          <div className="company-form">
            <form onSubmit={handleSubmit}>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
              <label>Contact:</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleFormChange} />
              <label>Country:</label>
              <input type="text" name="country" value={formData.country} onChange={handleFormChange} />
              <label>Phone:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} />
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
              <label>Website:</label>
              <input type="text" name="website" value={formData.website} onChange={handleFormChange} />
              <div className="form-actions">
                <button type="submit" className="submit-button">Save Company</button>
                <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyPage;
