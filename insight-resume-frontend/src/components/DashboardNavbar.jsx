import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/DashboardNavbar.css";

const DashboardNavbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="dash-navbar">
      <div className="dash-nav-container">
        {/* LEFT: LOGO */}
        <Link to="/dashboard" className="dash-brand" aria-label="Go to dashboard">
          <div className="logo-circle-small">IR</div>
          <span className="brand-text-dark">InsightResume</span>
        </Link>

        {/* CENTER: LINKS */}
        <div className="dash-links">
          <Link to="/dashboard" className={`dash-link ${isActive("/dashboard")}`}>
            Overview
          </Link>
          <Link to="/resume-analysis" className={`dash-link ${isActive("/resume-analysis")}`}>
            Resume Analyzer
          </Link>
          <Link to="/resume-builder" className={`dash-link ${isActive("/resume-builder")}`}>
            Resume Builder
          </Link>
          <Link to="/history" className={`dash-link ${isActive("/history")}`}>
            History
          </Link>
        </div>

        {/* RIGHT: PROFILE & LOGOUT */}
        <div className="dash-profile-section">
          <Link to="/profile" className="user-pill-link">
            <div className="user-pill">
              <div className="avatar-small">YY</div>
              <span className="user-name">Yon Yu Ki</span>
            </div>
          </Link>

          <Link to="/login" className="btn-logout-text">
            Sign Out
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
