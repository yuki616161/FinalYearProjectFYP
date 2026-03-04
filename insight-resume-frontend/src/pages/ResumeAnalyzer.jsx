// src/pages/ResumeAnalyzer.jsx
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { supabase } from '../supabaseClient';
import CreatableSelect from 'react-select/creatable';
import "../css/ResumeAnalyzer.css";

// --- ICONS ---
const UploadIcon = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const AlertIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
const RocketIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>);
const FileIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>);
const BookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
const ExternalLinkIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);
const PlayIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const SparkleIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);

const JOB_OPTIONS = [
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "Data Scientist", label: "Data Scientist" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Digital Marketer", label: "Digital Marketer" },
  { value: "Cybersecurity Analyst", label: "Cybersecurity Analyst" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
  { value: "Business Analyst", label: "Business Analyst" }
];

function ResumeAnalyzer() {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState({ value: "Software Engineer", label: "Software Engineer" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setStep(1);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    if (!selectedRole?.value) return alert("Please specify a target job role.");

    setLoading(true);
    setStep(2);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required. Please log in.");

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, selectedFile);
      if (uploadError) throw new Error(`Storage Upload Failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("job_role", selectedRole.value);

      const response = await fetch("http://127.0.0.1:5000/api/analyze", { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "AI Analysis server error.");
      }

      const aiData = await response.json();

      await supabase.from('resumes').insert({
        user_id: user.id, file_name: selectedFile.name, file_path: publicUrl, target_role: selectedRole.value, score: aiData.score, status: 'Analyzed'
      });

      await supabase.from('analysis_history').insert({
        user_id: user.id, file_name: selectedFile.name, target_role: selectedRole.value, score: aiData.score, strengths: aiData.strengths, gaps: aiData.gaps, recommendations: aiData.feedback_text
      });

      setResult(aiData);
      setStep(3);
    } catch (err) {
      console.error("Analysis Error:", err);
      alert(err.message);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const getCourseUrl = (item) => {
    if (item.course_url) return item.course_url;
    const query = encodeURIComponent(item.course_name);
    const platform = (item.platform || "").toLowerCase();

    if (platform.includes("youtube")) return `https://www.youtube.com/results?search_query=${query}+tutorial`;
    if (platform.includes("udemy")) return `https://www.udemy.com/courses/search/?q=${query}`;
    if (platform.includes("coursera")) return `https://www.coursera.org/search?query=${query}`;
    if (platform.includes("edx")) return `https://www.edx.org/search?q=${query}`;
    if (platform.includes("linkedin")) return `https://www.linkedin.com/learning/search?keywords=${query}`;
    return `https://www.google.com/search?q=${encodeURIComponent(item.course_name + " " + item.platform)}`;
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
              <div className="icon-wrapper bounce"><UploadIcon /></div>
              <h3>Upload your Document</h3>
              <p>Drag & drop or click to browse. Supports PDF & DOCX.</p>
              <button className="btn-secondary mt-4">Select File</button>
            </div>
          </div>
        )}

        {/* STEP 1: CONFIGURE */}
        {step === 1 && (
          <div className="choice-container fade-in">
            <div className="file-preview">
              <FileIcon />
              <div className="file-info">
                <span className="file-name">{selectedFile?.name}</span>
                <span className="file-status">Ready for Analysis</span>
              </div>
            </div>

            <div className="role-selector">
              <label>Target Job Role</label>
              <span className="role-helper-text">Select a common role or type a specific title to benchmark against.</span>
              <CreatableSelect
                isClearable
                options={JOB_OPTIONS}
                value={selectedRole}
                onChange={(newValue) => setSelectedRole(newValue || { value: "", label: "" })}
                placeholder="e.g., Senior Software Engineer..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="button-group">
              <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !selectedRole?.value}>
                <SparkleIcon /> Run AI Analysis
              </button>
              <button className="btn-text" onClick={() => setStep(0)}>Cancel</button>
            </div>
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === 2 && (
          <div className="loading-container fade-in">
            <div className="ai-scanner">
              <div className="scanner-line"></div>
            </div>
            <h3>Analyzing Document...</h3>
            <p>Evaluating keywords and mapping skills against <strong>{selectedRole.value}</strong> standards.</p>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === 3 && result && (
          <div className="report-container fade-in">
            {/* Header Banner */}
            <div className="report-header-card premium-gradient">
              <div className="score-section">
                <div className="score-ring glass">
                  <span>{result.score}</span>
                </div>
                <div className="score-label">MATCH SCORE</div>
              </div>
              <div className="header-text">
                <h2>Analysis: {selectedRole.value}</h2>
                <p className="score-explanation">
                  {result.score_explanation || "Tailored AI feedback based on industry requirements for your target role."}
                </p>
              </div>
            </div>

            <div className="report-grid">

              {/* Left Column */}
              <div className="main-column">
                <div className="content-card">
                  <h3 className="section-title">📝 Professional Feedback</h3>
                  <div className="feedback-text">{result.feedback_text}</div>
                </div>

                {result.learning_path && result.learning_path.length > 0 && (
                  <div className="content-card">
                    <h3 className="section-title"><BookIcon /> Strategic Career Roadmap</h3>
                    <p className="section-subtitle">Curated resources to close your specific skill gaps.</p>

                    <div className="timeline">
                      {result.learning_path.map((item, i) => {
                        const isYouTube = (item.platform || "").toLowerCase().includes("youtube");

                        return (
                          <div key={i} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content professional-course-card hover-lift">
                              <div className="course-header-row">
                                <span className="skill-badge">{item.skill}</span>
                                <span className={`platform-badge ${isYouTube ? 'youtube-badge' : ''}`}>
                                  {item.platform}
                                </span>
                              </div>
                              <h4 className="course-title">{item.course_name}</h4>
                              <p className="course-description">{item.description}</p>

                              <div className="course-metadata">
                                {item.difficulty && <span className="meta-tag">📊 {item.difficulty}</span>}
                              </div>

                              <a href={getCourseUrl(item)} target="_blank" rel="noopener noreferrer" className={`btn-course ${isYouTube ? 'youtube-link' : ''}`}>
                                {isYouTube ? (<>Watch on YouTube <PlayIcon /></>) : (<>Find Course <ExternalLinkIcon /></>)}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="side-column">
                <div className="content-card no-margin">
                  <h3 className="text-success mb-md">🌟 Key Strengths</h3>
                  <div className="tags-container">
                    {result.strengths?.map((s, i) => <div key={i} className="skill-tag strength"><CheckIcon /> {s}</div>)}
                  </div>
                </div>

                <div className="content-card no-margin">
                  <h3 className="text-danger mb-md">⚠️ Critical Gaps</h3>
                  <div className="tags-container">
                    {result.gaps?.map((g, i) => <div key={i} className="skill-tag gap"><AlertIcon /> {g}</div>)}
                  </div>
                </div>

                <div className="content-card action-section">
                  <h3 className="mb-md"><RocketIcon /> Recommended Next Steps</h3>
                  <div className="steps-list">
                    {result.action_steps?.map((step, i) => (
                      <div key={i} className="step-card">
                        <div className="step-number">{i + 1}</div>
                        <div className="step-content">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="footer-actions">
              <button className="btn-secondary" onClick={() => setStep(0)}>Analyze Another Resume</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;