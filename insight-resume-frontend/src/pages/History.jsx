import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/History.css";

// --- ICONS ---
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilePdfIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const FileWordIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

// --- MOCK DATA ---
const MOCK_HISTORY = [
  { id: 1, filename: "Yon_Software_Engineer_Resume.pdf", type: "pdf", job_role: "Software Engineer", score: 88, date: "Dec 18, 2025", time: "09:30 AM" },
  { id: 2, filename: "Yon_Data_Scientist_CV.docx", type: "docx", job_role: "Data Scientist", score: 74, date: "Dec 17, 2025", time: "02:15 PM" },
  { id: 3, filename: "Product_Manager_Draft_v3.pdf", type: "pdf", job_role: "Product Manager", score: 65, date: "Dec 15, 2025", time: "11:00 AM" },
  { id: 4, filename: "Internship_Application_2025.pdf", type: "pdf", job_role: "Frontend Developer", score: 92, date: "Dec 10, 2025", time: "04:45 PM" },
  { id: 5, filename: "Generic_Resume_Backup.docx", type: "docx", job_role: "Software Engineer", score: 45, date: "Dec 01, 2025", time: "10:20 AM" }
];

function History() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setHistory(MOCK_HISTORY);
      setLoading(false);
    }, 600);
  }, []);

  // Filter Logic
  const filteredHistory = history.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreBadge = (score) => {
    if (score >= 80) return <span className="badge badge-success">High Match ({score})</span>;
    if (score >= 60) return <span className="badge badge-warning">Medium ({score})</span>;
    return <span className="badge badge-danger">Low Match ({score})</span>;
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
              <p>No records found matching "{searchTerm}"</p>
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
                        {item.type === 'pdf' ? <FilePdfIcon /> : <FileWordIcon />}
                        <span className="filename-text">{item.filename}</span>
                      </div>
                    </td>
                    <td>
                      <span className="role-pill">{item.job_role}</span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date-main">{item.date}</span>
                        <span className="date-sub"><ClockIcon /> {item.time}</span>
                      </div>
                    </td>
                    <td>
                      {getScoreBadge(item.score)}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button className="btn-view" onClick={() => alert(`Opening report for ${item.filename}`)}>
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
    </div>
  );
}

export default History;