// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Sidebar.css'; // Make sure the path to your CSS file is correct

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Minimty admin</div>
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
        <NavLink to="/subscription" className="nav-item" activeClassName="active">subscription</NavLink>

        {/* Add more links here as needed */}
      </nav>
    </div>
  );
}

export default Sidebar;
