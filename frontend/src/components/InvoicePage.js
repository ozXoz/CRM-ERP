import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "../service/auth";
import "../css/SharedLayout.css";

function InvoicePage() {
  const [clients, setClients] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newInvoice, setNewInvoice] = useState({
    clientId: "",
    productCategoryId: "",
    productId: "",
    taxRateId: "",
    price: 0,
    quantity: 0,
    status: "",
    currency: "",
    date: "",
    expireDate: "",
    note: "",
    description: "",
    subtotal: 0,
    final_total: 0,
  });

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients
        const clientsRes = await fetch("http://localhost:3001/clients", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const clientsData = await clientsRes.json();

        // Fetch product categories
        const productCategoriesRes = await fetch(
          "http://localhost:3001/api/product-categories",
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const productCategoriesData = await productCategoriesRes.json();

        // Fetch products
        const productsRes = await fetch("http://localhost:3001/api/products", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const productsData = await productsRes.json();

        // Fetch tax rates
        const taxRatesRes = await fetch("http://localhost:3001/api/tax-rates", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const taxRatesData = await taxRatesRes.json();

        // Fetch invoices
        const invoicesRes = await fetch(
          "http://localhost:3001/api/invoices/getall",
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const invoicesData = await invoicesRes.json();

        setClients(clientsData);
        setProductCategories(productCategoriesData);
        setProducts(productsData);
        setTaxRates(taxRatesData);
        setInvoices(invoicesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Now calculateTotals is called with the current newInvoice state
    const { subtotal, final_total } = calculateTotals(newInvoice);
    setNewInvoice((prev) => ({
      ...prev,
      subtotal,
      final_total,
    }));
  }, [newInvoice.price, newInvoice.quantity, newInvoice.taxRateId, taxRates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`); 
    setNewInvoice((prevState) => {
      // Update the state based on input changes
      const updatedInvoice = { ...prevState, [name]: value };
      // If one of the critical values changes, recalculate totals immediately
      if (['price', 'quantity', 'taxRateId'].includes(name)) {
        return { ...updatedInvoice, ...calculateTotals(updatedInvoice) };
      }
      return updatedInvoice;
    });
  };
  const renderOptions = (items) => {
    return items.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name || item.categoryName || item.country || "Unknown"}
      </option>
    ));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error message
    setSuccessMessage(""); // Clear previous success message

    console.log("clientId:", newInvoice.clientId);
    console.log("productCategoryId:", newInvoice.productCategoryId);
    console.log("productId:", newInvoice.productId);
    console.log("taxRateId:", newInvoice.taxRateId);
    console.log("price:", newInvoice.price);
    console.log("quantity:", newInvoice.quantity);
    console.log("status:", newInvoice.status);
    console.log("currency:", newInvoice.currency);
    console.log("date:", newInvoice.date);
    console.log("expireDate:", newInvoice.expireDate);
    console.log("note:", newInvoice.note);
    console.log("description:", newInvoice.description);

    try {
      const response = await fetch("http://localhost:3001/api/invoices/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newInvoice),
      });

      if (!response.ok) {
        throw new Error("Failed to save the invoice");
      }

      // Assume response contains the newly added invoice
      const newInvoiceData = await response.json();
      setInvoices((prevInvoices) => [...prevInvoices, newInvoiceData]);
      setSuccessMessage("Invoice saved successfully!");

      // Reset form
      setNewInvoice({
        clientId: "",
        productCategoryId: "",
        productId: "",
        taxRateId: "",
        price: "",
        quantity: "",
        status: "",
        currency: "",
        date: "",
        expireDate: "",
        note: "",
        description: "",
        invoiceNumber: "", // Add invoiceNumber field
      });
    } catch (err) {
      setError("Could not save the invoice. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (currentInvoice) => {
    const taxRateObject = taxRates.find(rate => rate._id === currentInvoice.taxRateId);
    const selectedTaxRate = taxRateObject ? taxRateObject.totalTaxRate : 0;
    const subtotal = currentInvoice.price * currentInvoice.quantity;
    const final_total = subtotal + (subtotal * selectedTaxRate) / 100;
    return { subtotal, final_total };
  };
  

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Invoice Page</h1>
        <p>Manage your invoices here.</p>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <select
                name="clientId"
                value={newInvoice.clientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Client</option>
                {renderOptions(clients)}
              </select>
              <select
                name="productCategoryId"
                value={newInvoice.productCategoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product Category</option>
                {renderOptions(productCategories)}
              </select>
              <select
                name="productId"
                value={newInvoice.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product</option>
                {renderOptions(products)}
              </select>

              <input
                type="number"
                name="price"
                value={newInvoice.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              <input
                type="number"
                name="quantity"
                value={newInvoice.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                required
              />

              <input
                type="number"
                name="subtotal"
                value={newInvoice.subtotal}
                onChange={handleInputChange}
                placeholder="Subtotal"
                required
              />

<select
  name="taxRateId"
  value={newInvoice.taxRateId}
  onChange={handleInputChange}
  required
>
  <option value="">Select Tax Rate</option>
  {taxRates.map((taxRate) => (
    <option key={taxRate._id} value={taxRate._id}>
      {taxRate.country} - {taxRate.province} - {taxRate.totalTaxRate}%
    </option>
  ))}
</select>

              <input
                type="number"
                name="total"
                value={newInvoice.final_total}
                onChange={handleInputChange}
                placeholder="Total after tax"
                required
              />

              <input
                type="text"
                name="invoiceNumber" // Add invoiceNumber field
                value={newInvoice.invoiceNumber}
                onChange={handleInputChange}
                placeholder="Invoice Number" // Placeholder for invoiceNumber
                required
              />
              <select
                name="status"
                value={newInvoice.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <select
                name="currency"
                value={newInvoice.currency}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="date"
                name="date"
                value={newInvoice.date}
                onChange={handleInputChange}
                placeholder="Date"
                required
              />
              <input
                type="date"
                name="expireDate"
                value={newInvoice.expireDate}
                onChange={handleInputChange}
                placeholder="Expire Date"
                required
              />
              <textarea
                name="note"
                value={newInvoice.note}
                onChange={handleInputChange}
                placeholder="Note"
              />
              <textarea
                name="description"
                value={newInvoice.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
              <button type="submit">Save Invoice</button>
            </form>

            <h2>Existing Invoices</h2>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Currency</th>
                  <th>Date</th>
                  <th>Invoice Number</th>
                  {/* Include other headers as necessary */}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.clientId}</td>{" "}
                    {/* Replace with client name if available */}
                    <td>{invoice.productId}</td>{" "}
                    {/* Replace with product name if available */}
                    <td>{invoice.price}</td>
                    <td>{invoice.quantity}</td>
                    <td>{invoice.total}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.currency}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.invoiceNumber}</td>{" "}
                    {/* Add more details as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default InvoicePage;
