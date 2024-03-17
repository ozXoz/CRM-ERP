import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage"; // Adjust the path as necessary
import LoginPage from "./components/LoginPage"; // Adjust the path as necessary
import SignupPage from "./components/SignupPage"; // Adjust the path as necessary
import DashboardPage from "./components/DashboardPage"; // Adjust the path as necessary// Import new page components
import PeoplePage from "./components/PeoplePage";
import CompanyPage from "./components/CompanyPage";
import ClientPage from "./components/ClientPage";
import ProductPage from "./components/ProductPage";
import ProductCategoryPage from "./components/ProductCategoryPage";
import ExpensesCategoryPage from "./components/ExpensesCategoryPage";
import ExpensePage from "./components/ExpensePage";
import InvoicePage from "./components/InvoicePage";
import SubscriptionPage from "./components/SubscriptionPage";





function App() {
  return (
    <Router>
      <div>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add new routes here */}
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product-categories" element={<ProductCategoryPage />} />
          <Route path="/expenses-categories" element={<ExpensesCategoryPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/invoices" element={<InvoicePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
