// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import AnalysisInspector from "../pages/AnalysisInspector";
import "../css/AdminDashboard.css";

// --- ICONS ---
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const TrendUpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, totalScans: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      setLoading(true);

      const { count: userCount, data: userData, error: userError } = await supabase.from('profiles').select('*', { count: 'exact' });
      if (userError) throw userError;

      const { count: scanCount, error: scanError } = await supabase.from('analysis_history').select('*', { count: 'exact', head: true });
      if (scanError) throw scanError;

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase.from('analysis_history').select('*', { count: 'exact', head: true }).gte('created_at', yesterday);

      setStats({ totalUsers: userCount || 0, activeToday: activeCount || 0, totalScans: scanCount || 0 });
      setUsers(userData || []);
    } catch (err) {
      console.error("Admin Dashboard Error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || user.preferred_job?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (window.confirm("Warning: Deleting this user profile is permanent. Proceed?")) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) setUsers(users.filter(u => u.id !== id));
      else alert("Failed to delete user: " + error.message);
    }
  };

  const handleInspect = async (user) => {
    const { data, error } = await supabase.from('analysis_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (!error) setSelectedUserHistory({ user, history: data });
    else alert("Could not load user history.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- UPDATED EXPORT TO CSV (Removed Joined Date) ---
  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Role", "Target Job", "Experience"];
    const csvData = filteredUsers.map(u => {
      return [
        u.id,
        u.first_name || "N/A",
        u.last_name || "N/A",
        u.role || "Jobseeker",
        u.preferred_job || "Not set",
        u.experience_level || "Not specified"
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InsightResume_Students_Report.csv";
    a.click();
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">IR</div>
          <span className="brand-name">Admin<span>Panel</span></span>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-category">MAIN</div>
          <Link to="/admin" className="menu-item active"><UsersIcon /> Users</Link>
          <Link to="/admin/analytics" className="menu-item"><ActivityIcon /> Analytics</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="menu-item logout" onClick={handleSignOut} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <LogOutIcon /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="top-bar">
          <div>
            <h1>Overview</h1>
            <p className="subtitle">Real-time management of {stats.totalUsers} registered students.</p>
          </div>
          <div className="admin-profile-pill">
            <div className="avatar-circle">A</div>
            <div className="profile-info">
              <span className="name">Administrator</span>
              <span className="role">Super Admin</span>
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue"><UsersIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Total Users</span>
              <div className="stat-value-row">
                <h2>{stats.totalUsers}</h2>
                <span className="trend positive"><TrendUpIcon /> Live</span>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper green"><ActivityIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Active (24h)</span>
              <div className="stat-value-row">
                <h2>{stats.activeToday}</h2>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper purple"><EyeIcon /></div>
            <div className="stat-content">
              <span className="stat-label">Total Scans</span>
              <div className="stat-value-row">
                <h2>{stats.totalScans}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="table-card">
          <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
            <h3>Student Directory</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="search-wrapper" style={{ margin: 0 }}>
                <SearchIcon />
                <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button
                onClick={handleExportCSV}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}
                title="Download CSV Report"
              >
                <DownloadIcon /> Export
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                 <div className="spinner-small" style={{borderTopColor: '#2563eb'}}></div> Synchronizing with Supabase...
              </div>
            ) : filteredUsers.length === 0 ? (
               <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No students match your search.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Role</th>
                    <th>Experience Level</th>
                    <th>Target Job</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.first_name?.charAt(0) || 'U'}</div>
                          <div>
                            <div className="user-name">{user.first_name} {user.last_name}</div>
                            {/* Truncated ID so it looks clean */}
                            <div className="user-email" style={{fontFamily: 'monospace', fontSize: '0.75rem'}}>ID: {user.id.substring(0,8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* Dynamic styling for Admins vs Users */}
                        <span className="role-badge" style={user.role === 'Admin' ? { background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca'} : {}}>
                          {user.role || "Jobseeker"}
                        </span>
                      </td>
                      <td className="text-muted">{user.experience_level || "Not specified"}</td>
                      <td><span style={{ fontWeight: 500 }}>{user.preferred_job || <span style={{color: '#94a3b8'}}>Not set</span>}</span></td>

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
            )}
          </div>
        </div>

        {selectedUserHistory && (
          <AnalysisInspector user={selectedUserHistory.user} history={selectedUserHistory.history} onClose={() => setSelectedUserHistory(null)} />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;