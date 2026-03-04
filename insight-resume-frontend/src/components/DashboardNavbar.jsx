import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/DashboardNavbar.css";

const DashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State for dynamic user data & loading status
  const [userName, setUserName] = useState("");
  const [initials, setInitials] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Checks the current URL to highlight the active menu item
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true); // Start the loading animation

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Format the full name and initials
      if (profile && (profile.first_name || profile.last_name)) {
        const fName = profile.first_name || "";
        const lName = profile.last_name || "";
        const fullName = `${fName} ${lName}`.trim();
        setUserName(fullName);

        const firstInitial = fName ? fName.charAt(0).toUpperCase() : "";
        const lastInitial = lName ? lName.charAt(0).toUpperCase() : "";

        if (firstInitial && lastInitial) {
          setInitials(`${firstInitial}${lastInitial}`);
        } else {
          setInitials((firstInitial || lastInitial || fullName.substring(0, 2)).toUpperCase());
        }
      } else {
        // Fallback to email prefix if no name is set
        const emailPrefix = user.email.split('@')[0];
        setUserName(emailPrefix);
        setInitials(emailPrefix.substring(0, 2).toUpperCase());
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setIsLoading(false); // Stop the loading animation once data is ready
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

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
          <Link to="/profile" className="user-pill-link" style={{ textDecoration: 'none' }}>
            {isLoading ? (
              /* Skeleton Loader */
              <div className="skeleton-pill">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-text"></div>
              </div>
            ) : (
              /* Actual User Data */
              <div className="user-pill">
                <div className="avatar-small">{initials}</div>
                <span className="user-name">{userName}</span>
              </div>
            )}
          </Link>

          <button
            onClick={handleSignOut}
            className="btn-logout-text"
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "1rem" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;