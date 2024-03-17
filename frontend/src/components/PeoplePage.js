import React, { useState, useEffect, useRef, createRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/SharedLayout.css";
import { getToken } from "../service/auth";
import "../css/PeoplePage.css";

const API_ENDPOINT = "http://localhost:3001";
const api = axios.create({ baseURL: API_ENDPOINT });

api.interceptors.request.use(function (config) {
  const token = getToken();
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchPeople();
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

  const fetchPeople = async () => {
    try {
      const response = await api.get("/people");
      setPeople(response.data);
      dropdownRef.current = response.data.map((_, i) => dropdownRef.current[i] ?? createRef());
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const action = selectedPerson ? api.patch(`/people/${selectedPerson._id}`, formData) : api.post("/people", formData);
      await action;
      setIsAdding(false);
      setSelectedPerson(null);
      setActiveDropdown(null);
      fetchPeople();
      setFormData({ firstName: "", lastName: "", company: "", country: "", phone: "", email: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setSelectedPerson(null);
    setActiveDropdown(null);
    setFormData({ firstName: "", lastName: "", company: "", country: "", phone: "", email: "" });
  };

  const handleEditClick = (person) => {
    setIsAdding(false);
    setSelectedPerson(person);
    setFormData({ firstName: person.firstName, lastName: person.lastName, company: person.company, country: person.country, phone: person.phone, email: person.email });
    setActiveDropdown(null);
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/people/${id}`);
      fetchPeople();
    } catch (error) {
      console.error("Error deleting person:", error);
    }
    setActiveDropdown(null);
  };

  const handleCancelClick = () => {
    setIsAdding(false);
    setSelectedPerson(null);
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
          <h1>People List</h1>
          <div className="search-bar">
            <input type="text" placeholder="search" />
            <button className="refresh-button">Refresh</button>
            <button className="add-button" onClick={handleAddClick}>
              Add New Person
            </button>
          </div>
        </div>

        <table className="people-table">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Company</th>
              <th>Country</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => (
              <tr key={person._id}>
                <td>{person.firstName}</td>
                <td>{person.lastName}</td>
                <td>{person.company}</td>
                <td>{person.country}</td>
                <td>{person.phone}</td>
                <td>{person.email}</td>
                <td>
                <div className="action-buttons" ref={(el) => (dropdownRef.current[index] = el)}>
  <div className="relative-container">
    <button className="action-button" onClick={() => toggleDropdown(index)}>
      ...
    </button>
    {activeDropdown === index && (
      <div className="dropdown-content show">
        <button onClick={() => handleEditClick(person)}>Edit</button>
        <button onClick={() => handleDeleteClick(person._id)}>Delete</button>
      </div>
    )}
  </div>
</div>


                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(isAdding || selectedPerson) && (
          <div className="person-form">
            <form onSubmit={handleSubmit}>
              <label>First Name: <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} /></label>
              <label>Last Name: <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} /></label>
              <label>Company: <input type="text" name="company" value={formData.company} onChange={handleFormChange} /></label>
              <label>Country: <input type="text" name="country" value={formData.country} onChange={handleFormChange} /></label>
              <label>Phone: <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} /></label>
              <label>Email: <input type="email" name="email" value={formData.email} onChange={handleFormChange} /></label>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PeoplePage;
