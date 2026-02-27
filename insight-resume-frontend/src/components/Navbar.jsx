// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // <--- ADD THIS IMPORT

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="nav-brand">
          <div className="logo-circle-nav">IR</div>
          <span>InsightResume</span>
        </Link>

        {/* RIGHT SIDE BUTTONS */}
        <div className="nav-actions">
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;