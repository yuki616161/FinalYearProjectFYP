// src/pages/History.jsx
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { supabase } from '../supabaseClient';
import "../css/History.css";

// --- ICONS ---
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilePdfIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const XIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function History() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null); // For the Detail Modal

  useEffect(() => {
    fetchHistory();
  }, []);

  // 1. Fetch live data from Supabase
  async function fetchHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // 2. Filter Logic (Searching)
  const filteredHistory = history.filter(item =>
    item.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.target_role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreBadge = (score) => {
    if (score >= 80) return <span className="badge badge-success">High Match ({score}%)</span>;
    if (score >= 60) return <span className="badge badge-warning">Medium ({score}%)</span>;
    return <span className="badge badge-danger">Low Match ({score}%)</span>;
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <div className="page-wrapper">
        <div className="page-header-row">
          <div>
            <h1>Scan History</h1>
            <p>Archive of all your resume analyses and scores.</p>
          </div>
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by role or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-card fade-in">
          {loading ? (
            <div className="loading-state">
               <div className="spinner-small"></div> Loading records...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-state">
              <p>{searchTerm ? `No records found matching "${searchTerm}"` : "You haven't analyzed any resumes yet."}</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Target Role</th>
                  <th>Date Analyzed</th>
                  <th>Match Score</th>
                  <th style={{textAlign: 'right'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="file-info-cell">
                        <FilePdfIcon />
                        <span className="filename-text">{item.file_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="role-pill">{item.target_role}</span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date-main">{new Date(item.created_at).toLocaleDateString()}</span>
                        <span className="date-sub">
                          <ClockIcon /> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td>
                      {getScoreBadge(item.score)}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button className="btn-view" onClick={() => setSelectedReport(item)}>
                        View Report <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- DETAIL MODAL (Pop-up when View Report is clicked) --- */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedReport(null)}><XIcon /></button>

            <div className="modal-header">
              <h2>Analysis Report</h2>
              <span className="role-pill">{selectedReport.target_role}</span>
            </div>

            <div className="modal-body">
              <div className="report-stat">
                <label>Overall Match Score:</label>
                {getScoreBadge(selectedReport.score)}
              </div>

              <div className="report-section">
                <h3>📝 Professional Feedback</h3>
                <p>{selectedReport.recommendations || "No recommendations provided."}</p>
              </div>

              <div className="skills-split">
                <div className="skill-box">
                  <h4 className="text-success">🌟 Identified Strengths</h4>
                  <div className="tags">
                    {selectedReport.strengths?.map((s, i) => <span key={i} className="skill-tag strength">{s}</span>)}
                  </div>
                </div>
                <div className="skill-box">
                  <h4 className="text-danger">⚠️ Skill Gaps</h4>
                  <div className="tags">
                    {selectedReport.gaps?.map((g, i) => <span key={i} className="skill-tag gap">{g}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;