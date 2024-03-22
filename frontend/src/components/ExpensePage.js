import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../css/SharedLayout.css';
import '../css/ExpensePage.css'; // Adjust the path according to your file structure
import { getToken } from "../service/auth"; // Ensure this path matches your project structure

const ENDPOINT = "http://localhost:3001";

function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

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
    fetchExpenses();
    fetchExpenseCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${ENDPOINT}/api/expenses`, {
        name,
        category: selectedCategory,
        currency,
        total,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setName('');
      setSelectedCategory('');
      setCurrency('EUR');
      setTotal('');
      setDescription('');
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Expenses Page</h1>
        <p>Manage your expenses here.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <select value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="EUR">Euro</option>
            <option value="USD">Dollar</option>
          </select>
          <input type="number" placeholder="Total" value={total} onChange={e => setTotal(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
          <button type="submit">Add Expense</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Currency</th>
              <th>Total</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.name}</td>
                <td>{expense.category.name}</td>
                <td>{expense.currency}</td>
                <td>{expense.total}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpensePage;
