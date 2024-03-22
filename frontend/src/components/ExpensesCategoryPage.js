import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/SharedLayout.css";
import '../css/ExpensesCategoryPage.css'; // Adjust the path according to your file structure
import { getToken } from "../service/auth"; // Ensure this path matches your project structure

const ENDPOINT = "http://localhost:3001";

function ExpensesCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  // Define fetchExpenseCategories outside of useEffect to make it accessible throughout the component
  const fetchExpenseCategories = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/api/expense-categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${ENDPOINT}/api/expense-categories`,
        { name, description, note },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setName("");
      setDescription("");
      setNote("");
      // Refresh the list of categories after adding a new one
      fetchExpenseCategories();
    } catch (error) {
      console.error("Error adding expense category:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Expense Categories Page</h1>
        <p>Manage your expense categories here.</p>
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

export default ExpensesCategoryPage;
