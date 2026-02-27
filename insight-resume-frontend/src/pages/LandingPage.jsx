// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/LandingPage.css';

// --- ICONS (Tailored to your project) ---
const UploadIcon = () => <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const GapIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3"></path></svg>;
const BookIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const RobotIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;
const CheckCircle = () => <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>;
const WarningIcon = () => <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;

function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); navigate('/signup'); };

  return (
    <div className="landing-page">
      <Navbar />

      {/* 1. TECH GRID BACKGROUND */}
      <div className="grid-background"></div>

      {/* 2. SOFT GLOW BLOBS */}
      <div className="bg-blob blob-purple"></div>
      <div className="bg-blob blob-indigo"></div>

      <div className="landing-content">

        {/* --- HERO HEADER --- */}
        <div className="landing-header">
          <div className="pill-badge">🚀 Powered by NLP & Machine Learning</div>
          <h1>
            Bridge the gap between <br />
            your resume and <span className="highlight-text">your dream job.</span>
          </h1>
          <p>
            Upload your resume to get an instant <strong>Skill Gap Report</strong> and
            <strong> Personalized Learning Paths</strong> tailored to market demands.
          </p>
        </div>

        {/* --- HERO UPLOAD SECTION --- */}
        <div className="hero-wrapper">

          {/* FLOATING BADGE 1: Skill Gap Detection */}
          <div className="floating-badge badge-left">
            <div className="badge-icon icon-yellow"><WarningIcon /></div>
            <div>
              <span className="badge-title">Skill Gap Detected</span>
              <span className="badge-sub">Missing: Python, SQL</span>
            </div>
          </div>

          {/* FLOATING BADGE 2: Learning Recommendation */}
          <div className="floating-badge badge-right">
            <div className="badge-icon icon-green"><CheckCircle /></div>
            <div>
              <span className="badge-title">Course Suggested</span>
              <span className="badge-sub">"Advanced Data Science"</span>
            </div>
          </div>

          {/* UPLOAD CARD */}
          <div
            className={`upload-hero-card ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => navigate('/signup')}
          >
            <div className="icon-circle-large">
              <UploadIcon />
            </div>
            <h2>Analyze My Resume</h2>
            <p className="upload-instruction">Drag & drop your PDF here to identify your strengths & weaknesses.</p>
            <button className="btn-cta-primary">Get Your Skill Report</button>
            <div className="upload-meta">Supports PDF & DOCX • AI Analysis in Seconds</div>
          </div>
        </div>

        {/* --- FEATURES SECTION (Based on Proposal Objectives) --- */}
        <div className="features-section">
          <h3 className="section-title">How we improve your employability</h3>

          <div className="features-grid">
            {/* Feature 1: AI Analysis */}
            <div className="feature-card">
              <div className="feature-icon icon-indigo">
                <RobotIcon />
              </div>
              <div className="feature-text">
                <h3>AI Resume Analysis</h3>
                <p>We use NLP to parse your experience and education, detecting strengths that recruiters look for.</p>
              </div>
            </div>

            {/* Feature 2: Skill Gap */}
            <div className="feature-card">
              <div className="feature-icon icon-red">
                <GapIcon />
              </div>
              <div className="feature-text">
                <h3>Skill Gap Detection</h3>
                <p>We compare your profile against real-time job market data to highlight missing technical skills.</p>
              </div>
            </div>

            {/* Feature 3: Learning Paths */}
            <div className="feature-card">
              <div className="feature-icon icon-green">
                <BookIcon />
              </div>
              <div className="feature-text">
                <h3>Learning Recommendations</h3>
                <p>Don't just see the gap—close it. Get personalized course and certification suggestions.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;