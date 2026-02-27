import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/ResumeAnalyzer.css";

// --- ICONS ---
const UploadIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const AlertIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
const RocketIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>);
const FileIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>);
const BookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
const ExternalLinkIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);

// --- JOB ROLES ---
const JOB_ROLES = [
  "Software Engineer", "Data Scientist", "Product Manager",
  "UI/UX Designer", "Digital Marketer", "Cybersecurity Analyst",
  "DevOps Engineer", "Business Analyst"
];

function ResumeAnalyzer() {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setStep(1);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return alert("Upload a file first.");
    setLoading(true);
    setStep(2);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_role", selectedRole);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server Error");
      }

      const data = await response.json();
      setResult(data);
      setStep(3);
    } catch (err) {
      alert(err.message);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      <main className="main-content">
        <div className="page-header">
          <h1>AI Resume Analyzer</h1>
          <p>Get professional feedback and a personalized learning path.</p>
        </div>

        {/* STEP 0: UPLOAD */}
        {step === 0 && (
          <div className="upload-container fade-in">
            <input type="file" id="resume" hidden onChange={handleFileChange} accept=".pdf,.docx" />
            <div className="upload-card" onClick={() => document.getElementById("resume").click()}>
              <div className="icon-wrapper"><UploadIcon /></div>
              <h3>Upload Resume</h3>
              <p>Supports PDF & DOCX</p>
              <button className="btn-browse">Select File</button>
            </div>
          </div>
        )}

        {/* STEP 1: JOB ROLE */}
        {step === 1 && (
          <div className="choice-container fade-in">
            <div className="file-preview">
              <FileIcon />
              <div className="file-info">
                <span className="file-name">{selectedFile?.name}</span>
                <span className="file-status">Ready</span>
              </div>
            </div>
            <div className="role-selector">
              <label>Target Job Role:</label>
              <select className="role-dropdown" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                {JOB_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="button-group">
              <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>Run AI Analyze</button>
              <button className="btn-text" onClick={() => setStep(0)}>Cancel</button>
            </div>
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === 2 && (
          <div className="loading-container fade-in">
            <div className="spinner"></div>
            <h3>Analyzing...</h3>
            <p>Comparing your profile against <strong>{selectedRole}</strong> standards.</p>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === 3 && result && (
          <div className="report-container fade-in">
            {/* Header */}
            <div className="report-header-card">
              <div className="score-section">
                <div className="score-ring"><span>{result.score}</span></div>
                <div className="score-label">MATCH SCORE</div>
              </div>
              <div className="header-text">
                <h2>Analysis: {selectedRole}</h2>
                <p>Tailored feedback for your target position.</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="content-card feedback-section">
              <h3>📝 Professional Feedback</h3>
              <div className="feedback-text">{result.feedback_text}</div>
            </div>

            {/* Strengths & Gaps */}
            <div className="skills-grid">
              <div className="content-card">
                <h3 className="text-success">🌟 Strengths</h3>
                <div className="tags-container">
                  {result.strengths?.map((s, i) => <div key={i} className="skill-tag strength"><CheckIcon /> {s}</div>)}
                </div>
              </div>
              <div className="content-card">
                <h3 className="text-danger">⚠️ Skill Gaps</h3>
                <div className="tags-container">
                  {result.gaps?.map((g, i) => <div key={i} className="skill-tag gap"><AlertIcon /> {g}</div>)}
                </div>
              </div>
            </div>

            {/* LEARNING PATHWAY (NEW) */}
            {result.learning_path && (
              <div className="content-card learning-section">
                <h3><BookIcon /> Recommended Learning Path</h3>
                <p className="section-subtitle">Courses selected to bridge your specific gaps.</p>
                <div className="timeline">
                  {result.learning_path.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-marker">{i + 1}</div>
                      <div className="timeline-content">
                        <div className="course-header">
                          <span className="skill-badge">{item.skill}</span>
                          <span className="platform-badge">{item.platform}</span>
                        </div>
                        <h4>{item.course_name}</h4>
                        <p>{item.description}</p>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(item.course_name + " " + item.platform + " course")}`}
                          target="_blank" rel="noopener noreferrer" className="btn-course"
                        >
                          Start Learning <ExternalLinkIcon />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Steps */}
            <div className="content-card action-section">
              <h3><RocketIcon /> Next Steps</h3>
              <div className="steps-list">
                {result.action_steps?.map((step, i) => (
                  <div key={i} className="step-card">
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-actions">
              <button className="btn-secondary" onClick={() => setStep(0)}>Analyze Another</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;