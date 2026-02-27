// src/pages/Dashboard.jsx
import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import '../css/Dashboard.css';

// Icons
const UploadIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const ArrowIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>;
const TrendIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>;

function Dashboard() {
  // Mock Data for "Recent Activity"
  const recentUploads = [
    { id: 1, name: "Resume_Software_Eng.pdf", date: "2 hours ago", score: 85, status: "High" },
    { id: 2, name: "Yon_Internship_CV.docx", date: "1 day ago", score: 64, status: "Medium" },
    { id: 3, name: "Old_Resume_2024.pdf", date: "3 days ago", score: 42, status: "Low" },
  ];

  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <main className="main-content">

        {/* HEADER SECTION */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Yon Yu Ki. Here is your employability overview.</p>
          </div>
          <button className="btn-primary-action">
            <UploadIcon /> New Scan
          </button>
        </div>

        {/* TOP STATS ROW */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Scans</div>
            <div className="stat-value">12</div>
            <div className="stat-trend positive">↑ 2 this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Score</div>
            <div className="stat-value">78%</div>
            <div className="stat-trend neutral">− No change</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Critical Gaps</div>
            <div className="stat-value warning-text">5</div>
            <div className="stat-trend negative">↓ Action Needed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Job Match</div>
            <div className="stat-value">High</div>
            <div className="stat-sub">Software Engineer</div>
          </div>
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="dashboard-grid">

          {/* LEFT COLUMN: Activity & Tools */}
          <div className="content-left">

            {/* 1. RECENT ACTIVITY TABLE */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Recent Analysis</h3>
                <a href="#" className="view-all">View All</a>
              </div>
              <div className="table-container">
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Date</th>
                      <th>ATS Score</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map((file) => (
                      <tr key={file.id}>
                        <td className="file-cell">
                          <div className="file-icon">📄</div>
                          {file.name}
                        </td>
                        <td className="date-cell">{file.date}</td>
                        <td className="score-cell">
                          <span className={`score-badge ${file.status.toLowerCase()}`}>
                            {file.score}/100
                          </span>
                        </td>
                        <td>
                          <span className={`status-dot ${file.status.toLowerCase()}`}></span>
                          {file.status} Match
                        </td>
                        <td><a href="#" className="table-link">Report →</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. MAIN TOOLS */}
            <section className="dashboard-section">
              <h3>Quick Tools</h3>
              <div className="tools-row">
                <div className="tool-card-small">
                  <div className="tool-icon purple">🚀</div>
                  <div>
                    <h4>Career Path</h4>
                    <p>View your roadmap to Senior Dev</p>
                  </div>
                </div>
                <div className="tool-card-small">
                  <div className="tool-icon orange">⚡</div>
                  <div>
                    <h4>Skill Gap Report</h4>
                    <p>Compare against 500+ job postings</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Insights & Learning */}
          <div className="content-right">

            {/* 3. MARKET TRENDS WIDGET */}
            <div className="widget-card">
              <div className="widget-header">
                <h3>Market Trends</h3>
                <TrendIcon />
              </div>
              <p className="widget-sub">Top skills employers are hiring for today.</p>

              <div className="trends-list">
                <div className="trend-item">
                  <span>Python</span>
                  <span className="trend-pill hot">🔥 Hot</span>
                </div>
                <div className="trend-item">
                  <span>React.js</span>
                  <span className="trend-pill hot">🔥 Hot</span>
                </div>
                <div className="trend-item">
                  <span>Cloud (AWS)</span>
                  <span className="trend-pill rising">📈 Rising</span>
                </div>
                <div className="trend-item">
                  <span>Docker</span>
                  <span className="trend-pill stable">Stable</span>
                </div>
              </div>
            </div>

            {/* 4. RECOMMENDED LEARNING */}
            <div className="widget-card highlight-card">
              <h3>Recommended for you</h3>
              <p>Close your "Cloud Computing" gap.</p>

              <div className="course-card">
                <div className="course-img"></div>
                <div className="course-info">
                  <h4>AWS Certified Practitioner</h4>
                  <span>Coursera • 20 Hours</span>
                </div>
              </div>

              <button className="btn-outline">View Learning Path</button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;