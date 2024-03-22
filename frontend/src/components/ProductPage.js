import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../css/SharedLayout.css";
import { getToken } from "../service/auth"; // Adjust this import if necessary

const ENDPOINT = "http://localhost:3001";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Define fetchProducts outside of useEffect to make it accessible throughout the component
  const fetchProducts = async () => {
    const token = getToken();
    try {
      const productsResponse = await axios.get(`${ENDPOINT}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch product categories
  const fetchProductCategories = async () => {
    const token = getToken();
    try {
      const categoriesResponse = await axios.get(`${ENDPOINT}/api/product-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      await axios.post(
        `${ENDPOINT}/api/products`,
        {
          name,
          category: selectedCategory,
          currency,
          price,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName("");
      setSelectedCategory("");
      setCurrency("EUR");
      setPrice("");
      setDescription("");
      // Refresh the list of products
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Product Page</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EUR">Euro</option>
            <option value="USD">Dollar</option>
            {/* Add more currencies as needed */}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button type="submit">Add Product</button>
        </form>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - {product.currency} {product.price} - {product.description}
              {/* Display category name if needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductPage;
