// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

// Icons
const HomeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UserIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-circle-small">IR</div>
        <h2>InsightResume</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <HomeIcon /> <span>Overview</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
          <UserIcon /> <span>Profile</span>
        </Link>
        <Link to="/login" className="nav-item logout">
          <LogoutIcon /> <span>Sign Out</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;