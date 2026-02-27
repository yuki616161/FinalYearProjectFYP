import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnalysisInspector from "../components/AnalysisInspector";
import "../css/AdminDashboard.css";

// --- ICONS ---
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const TrendUpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);

  // 1. LOAD USERS (Mock Data)
  useEffect(() => {
    setUsers([
      { id: 1, name: "Yon Yu Ki", email: "yonyuki@student.uum.edu.my", role: "Jobseeker", status: "Active", scans: 12, joined: "2 days ago" },
      { id: 2, name: "Ali Bin Abu", email: "ali@example.com", role: "Jobseeker", status: "Active", scans: 5, joined: "5 days ago" },
      { id: 3, name: "Sarah Tan", email: "sarah@example.com", role: "Jobseeker", status: "Inactive", scans: 0, joined: "1 week ago" },
      { id: 4, name: "John Doe", email: "john@tech.com", role: "Jobseeker", status: "Active", scans: 8, joined: "2 weeks ago" },
    ]);
  }, []);

  // 2. SEARCH FILTER
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. DELETE HANDLER
  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // 4. INSPECT HANDLER (Opens Modal)
  const handleInspect = (user) => {
    setSelectedUserHistory({
      user: user,
      history: [
        {
          id: 101,
          date: "2025-12-01",
          job_role: "Software Engineer",
          score: 85,
          extracted_skills: "React, Node.js, SQL, Git",
          education: "Bachelor of Computer Science, UUM"
        },
        {
          id: 102,
          date: "2025-12-05",
          job_role: "Data Analyst",
          score: 62,
          extracted_skills: "Excel, Python, Tableau",
          education: "Bachelor of Computer Science, UUM"
        }
      ]
    });
  };

  return (
    <div className="admin-layout">

      {/* --- SIDEBAR --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">IR</div>
          <span className="brand-name">Admin<span style={{color:'#6366f1'}}>Panel</span></span>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-category">MAIN</div>
          {/* Active Link for Users */}
          <Link to="/admin" className="menu-item active">
            <UsersIcon /> Users
          </Link>
          {/* Link to Analytics Page */}
          <Link to="/admin/analytics" className="menu-item">
            <ActivityIcon /> Analytics
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="menu-item logout">
            <LogOutIcon /> Sign Out
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="admin-main">

        {/* TOP HEADER */}
        <header className="top-bar">
          <div>
            <h1>Overview</h1>
            <p className="subtitle">Manage users and monitor system health.</p>
          </div>
          <div className="admin-profile-pill">
            <div className="avatar-circle">A</div>
            <div className="profile-info">
              <span className="name">Administrator</span>
              <span className="role">Super Admin</span>
            </div>
          </div>
        </header>

        {/* STATS WIDGETS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue"><UsersIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Total Users</span>
              <div className="stat-value-row">
                <h2>{users.length}</h2>
                <span className="trend positive"><TrendUpIcon /> +12%</span>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper green"><ActivityIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Active Today</span>
              <div className="stat-value-row">
                <h2>2</h2>
                <span className="trend positive"><TrendUpIcon /> +5%</span>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper purple"><EyeIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Total Scans</span>
              <div className="stat-value-row">
                <h2>143</h2>
                <span className="trend neutral">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* USERS TABLE CARD */}
        <div className="table-card">
          <div className="table-header">
            <h3>Registered Users</h3>
            <div className="search-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Scans</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td>
                      <span className={`status-dot ${user.status.toLowerCase()}`}></span>
                      <span className="status-text">{user.status}</span>
                    </td>
                    <td className="text-muted">{user.joined}</td>
                    <td className="font-medium">{user.scans}</td>
                    <td className="text-right">
                      <button className="icon-btn view" onClick={() => handleInspect(user)} title="View History">
                        <EyeIcon />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(user.id)} title="Delete User">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALYSIS INSPECTOR MODAL */}
        <AnalysisInspector
          user={selectedUserHistory?.user}
          history={selectedUserHistory?.history}
          onClose={() => setSelectedUserHistory(null)}
        />

      </main>
    </div>
  );
}

export default AdminDashboard;