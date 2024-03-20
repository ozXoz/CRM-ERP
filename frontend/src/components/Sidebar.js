import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Sidebar.css"; // Ensure the path to your CSS file is correct

function Sidebar() {
  const userRole = localStorage.getItem("userRole");
  console.log("Current user role from localStorage:", userRole);

  return (
    <div className="sidebar">
      <div className="sidebar-header">Minimty Admin</div>
      <nav className="nav">
        <NavLink to="/dashboard" className="nav-item" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/people" className="nav-item" activeClassName="active">People</NavLink>
        <NavLink to="/company" className="nav-item" activeClassName="active">Company</NavLink>
        <NavLink to="/clients" className="nav-item" activeClassName="active">Clients</NavLink>
        <NavLink to="/products" className="nav-item" activeClassName="active">Products</NavLink>
        <NavLink to="/product-categories" className="nav-item" activeClassName="active">Product Categories</NavLink>
        <NavLink to="/expenses-categories" className="nav-item" activeClassName="active">Expenses Categories</NavLink>
        <NavLink to="/expenses" className="nav-item" activeClassName="active">Expenses</NavLink>
        <NavLink to="/invoices" className="nav-item" activeClassName="active">Invoices</NavLink>
        <NavLink to="/subscription" className="nav-item" activeClassName="active">Subscription</NavLink>
        {userRole === "Admin" && (
          <NavLink to="/new-user" className="nav-item" activeClassName="active">New User</NavLink>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
