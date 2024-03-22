import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/SharedLayout.css"; // Ensure the CSS path is correct for your project
import { getToken } from "../service/auth"; // Adjust this import if necessary

const ENDPOINT = "http://localhost:3001";

function ProductCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  // Fetch product categories
  const fetchProductCategories = async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${ENDPOINT}/api/product-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      await axios.post(
        `${ENDPOINT}/api/product-categories`,
        { name, description, note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName("");
      setDescription("");
      setNote("");
      // Refresh the list of categories after adding a new one
      fetchProductCategories();
    } catch (error) {
      console.error("Error adding product category:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Product Categories Page</h1>
        <p>Manage your product categories here.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <button type="submit">Add Category</button>
        </form>
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              {category.name} - {category.description || 'No Description'} - {category.note || 'No Note'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductCategoryPage;
