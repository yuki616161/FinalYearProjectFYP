// src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import AnalysisInspector from "../components/AnalysisInspector";
import "../css/AdminDashboard.css";

// --- ICONS ---
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

function AdminAnalytics() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemLogs();
  }, []);

  // 1. FETCH LIVE SYSTEM LOGS
  async function fetchSystemLogs() {
    try {
      setLoading(true);

      // Fetch all analysis records
      const { data: historyData, error: historyError } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // Fetch profiles to get the users' names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Merge the data sets
      const mergedLogs = historyData.map(log => {
        const userProfile = profilesData.find(p => p.id === log.user_id);
        const userName = userProfile
          ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
          : "Unknown Student";

        return {
          ...log,
          userName,
          // Convert the PostgreSQL array into a readable string
          extracted_skills: log.strengths ? log.strengths.join(", ") : "No skills detected"
        };
      });

      setLogs(mergedLogs);
    } catch (err) {
      console.error("Error fetching logs:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // 2. SEARCH FILTER (By name, role, or skills)
  const filteredLogs = logs.filter(log =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.extracted_skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. OPEN INSPECTOR MODAL
  const openInspector = (log) => {
    setSelectedScan({
      user: { name: log.userName },
      // Pass the full log object so the modal can read strengths, gaps, and recommendations
      history: [log]
    });
  };

  // 4. SIGN OUT
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
          <Link to="/admin" className="menu-item">
            <UsersIcon /> Users
          </Link>
          <Link to="/admin/analytics" className="menu-item active">
            <ActivityIcon /> Analytics
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item logout" onClick={handleSignOut} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <LogOutIcon /> Sign Out
          </button>
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
                    placeholder="Search logs or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{paddingLeft:'35px', paddingRight:'10px', height:'38px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none'}}
                  />
               </div>
               <button className="icon-btn" title="Filter"><FilterIcon /></button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading system logs...</div>
            ) : filteredLogs.length === 0 ? (
               <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No analysis records found.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Student</th>
                    <th>Target Job Role</th>
                    <th>Score</th>
                    <th>Extracted Data (Preview)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td className="text-muted">
                        {new Date(log.created_at).toLocaleDateString()}<br/>
                        <span style={{fontSize: '0.75rem'}}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="font-medium">{log.userName}</td>
                      <td><span className="role-badge">{log.target_role || "Unspecified"}</span></td>
                      <td>
                        <span className={`score-badge ${log.score >= 70 ? 'high' : 'low'}`} style={{ fontWeight: 'bold', color: log.score >= 70 ? '#16a34a' : '#ea580c' }}>
                          {log.score}%
                        </span>
                      </td>
                      <td style={{maxWidth: '300px'}} className="text-muted">
                        <span className="truncate-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {log.extracted_skills}
                        </span>
                      </td>
                      <td>
                        <button className="btn-secondary" style={{fontSize:'0.8rem', padding:'6px 12px', border:'1px solid #e2e8f0', borderRadius:'6px', background:'white', cursor:'pointer'}} onClick={() => openInspector(log)}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* INSPECTOR MODAL */}
        {selectedScan && (
          <AnalysisInspector
            user={selectedScan.user}
            history={selectedScan.history}
            onClose={() => setSelectedScan(null)}
          />
        )}

      </main>
    </div>
  );
}

export default AdminAnalytics;