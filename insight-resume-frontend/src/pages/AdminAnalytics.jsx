import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnalysisInspector from "../components/AnalysisInspector";
import "../css/AdminDashboard.css";

// --- ICONS ---
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

function AdminAnalytics() {
  const [logs, setLogs] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);

  // MOCK DATA
  useEffect(() => {
    setLogs([
      { id: 205, user: "Yon Yu Ki", job_role: "Software Engineer", date: "2025-12-12 10:30 AM", score: 85, extracted_skills: "React, Node.js", education: "BSc CS", status: "Verified" },
      { id: 204, user: "Sarah Tan", job_role: "Data Analyst", date: "2025-12-12 09:15 AM", score: 62, extracted_skills: "Python, SQL", education: "BSc Data Science", status: "Flagged" },
      { id: 203, user: "Ali Bin Abu", job_role: "Project Manager", date: "2025-12-11 04:45 PM", score: 45, extracted_skills: "Agile, Jira", education: "MBA", status: "Verified" },
      { id: 202, user: "John Doe", job_role: "Software Engineer", date: "2025-12-11 02:20 PM", score: 78, extracted_skills: "Java, Spring", education: "BSc IT", status: "Verified" },
    ]);
  }, []);

  const openInspector = (log) => {
    setSelectedScan({
      user: { name: log.user },
      history: [log]
    });
  };

  return (
    <div className="admin-layout">

      {/* --- SIDEBAR (Fixed: Links Added) --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">IR</div>
          <span className="brand-name">Admin<span style={{color:'#6366f1'}}>Panel</span></span>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-category">MAIN</div>

          {/* Link to Users (Inactive style) */}
          <Link to="/admin" className="menu-item">
            <UsersIcon /> Users
          </Link>

          {/* Link to Analytics (ACTIVE style) */}
          <Link to="/admin/analytics" className="menu-item active">
            <ActivityIcon /> Analytics
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="menu-item logout">
            <LogOutIcon /> Sign Out
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="admin-main">
        <header className="top-bar">
          <div>
            <h1>Global Analysis Logs</h1>
            <p className="subtitle">Monitor NLP performance and user scans in real-time.</p>
          </div>
        </header>

        <div className="table-card">
          <div className="table-header">
            <h3>Recent System Activity</h3>
            <div className="search-wrapper" style={{width: 'auto', display:'flex', gap:'10px'}}>
               <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                  <SearchIcon style={{position:'absolute', left:'10px', color:'#9ca3af'}} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    style={{paddingLeft:'35px', paddingRight:'10px', height:'38px', borderRadius:'8px', border:'1px solid #e2e8f0'}}
                  />
               </div>
               <button className="icon-btn" title="Filter"><FilterIcon /></button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Target Job Role</th>
                  <th>Score</th>
                  <th>Extracted Data (Preview)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted">{log.date}</td>
                    <td className="font-medium">{log.user}</td>
                    <td><span className="role-badge">{log.job_role}</span></td>
                    <td>
                      <span className={`score-badge ${log.score >= 70 ? 'high' : 'low'}`}>
                        {log.score}
                      </span>
                    </td>
                    <td style={{maxWidth: '300px'}} className="text-muted">
                      <span className="truncate-text">{log.extracted_skills}</span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{fontSize:'0.8rem', padding:'6px 12px'}} onClick={() => openInspector(log)}>
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INSPECTOR MODAL */}
        <AnalysisInspector
          user={selectedScan?.user}
          history={selectedScan?.history}
          onClose={() => setSelectedScan(null)}
        />

      </main>
    </div>
  );
}

export default AdminAnalytics;