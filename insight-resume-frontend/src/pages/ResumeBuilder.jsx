// src/pages/ResumeBuilder.jsx
import React, { useState, useRef } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/ResumeBuilder.css";

// --- ICONS ---
const DownloadIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const MagicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 21v-8"/><path d="m7 8 4-4 4 4"/><path d="M11 4v8"/><path d="M5 12h14"/><path d="m16 9-2.5 2.5-2.5-2.5"/><path d="m11 15 2.5-2.5 2.5 2.5"/></svg>;
const SparkleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // --- AI ANALYSIS STATE ---
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetJob, setTargetJob] = useState("");

  const resumeRef = useRef();

  const [themeColor, setThemeColor] = useState("#2563eb");
  const [template, setTemplate] = useState("modern");

  const [resumeData, setResumeData] = useState({
    profile: { name: "", email: "", phone: "", linkedin: "", summary: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });

  const presetColors = ["#0f172a", "#1e3a8a", "#2563eb", "#0ea5e9", "#059669", "#dc2626", "#d97706", "#db2777"];

  const loadDemoData = () => {
    setResumeData({
      profile: { name: "ALEX JOHNSON", email: "alex.j@example.com", phone: "+60 12-345 6789", linkedin: "linkedin.com/in/alexj", summary: "Motivated Software Engineer with 3+ years of experience in building scalable web applications. Passionate about cloud computing and AI solutions." },
      experience: [{ id: 1, role: "Frontend Developer", company: "TechNova", duration: "2021 - Present", description: "Built responsive UI using React.js and reduced page load time by 30%." }],
      education: [{ id: 1, school: "University of Malaya", degree: "BSc Computer Science", year: "2021" }],
      skills: [{ id: 1, name: "React.js" }, { id: 2, name: "Python" }, { id: 3, name: "Tailwind CSS" }],
      projects: [{ id: 1, name: "E-Commerce App", link: "github.com/alexj", description: "Built a full-stack MERN e-commerce platform with Stripe integration." }],
      languages: [{ id: 1, name: "English (Fluent)", level: "" }, { id: 2, name: "Malay (Native)", level: "" }]
    });
  };

  const handleProfileChange = (e) => setResumeData({ ...resumeData, profile: { ...resumeData.profile, [e.target.name]: e.target.value } });
  const handleArrayChange = (section, id, field, value) => setResumeData({ ...resumeData, [section]: resumeData[section].map(item => item.id === id ? { ...item, [field]: value } : item) });
  const addItem = (section) => setResumeData({ ...resumeData, [section]: [...resumeData[section], { id: Date.now(), role: "", company: "", school: "", name: "", link: "", description: "" }] });
  const removeItem = (section, id) => setResumeData({ ...resumeData, [section]: resumeData[section].filter(item => item.id !== id) });

  const downloadPDF = () => window.print();

  const downloadDOCX = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/generate-resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resumeData, design: { themeColor, template } }),
      });
      if (response.ok) {
        const url = window.URL.createObjectURL(await response.blob());
        const a = document.createElement("a"); a.href = url; a.download = `${resumeData.profile.name || 'Resume'}.docx`; a.click();
      }
    } catch (e) { alert("Error connecting to server."); } finally { setLoading(false); }
  };

  const openAnalysisModal = () => { setShowModal(true); setAnalyzing(false); setAnalysisResult(null); };

  const runAnalysis = async () => {
    if (!targetJob.trim()) return alert("Please enter a target job role to continue.");
    setAnalyzing(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/analyze-direct", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_role: targetJob, resume_data: resumeData }),
      });
      const data = await response.json();
      if (response.ok) setAnalysisResult(data);
      else { alert(data.error || "Failed to analyze resume."); setShowModal(false); }
    } catch (err) { alert("Error connecting to server."); setShowModal(false); } finally { setAnalyzing(false); }
  };

  // --- FIX: Helper function to safely singularize tab names ---
  const getSingularTabName = (tab) => {
    if (tab.endsWith('s')) {
      return tab.charAt(0).toUpperCase() + tab.slice(1, -1); // "projects" -> "Project"
    }
    return tab.charAt(0).toUpperCase() + tab.slice(1); // "experience" -> "Experience"
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <div className="builder-wrapper">
        {/* --- LEFT: EDITOR PANEL --- */}
        <div className="editor-panel">
          <div className="editor-header">
            <h2>Resume Builder</h2>
            <button className="btn-demo" onClick={loadDemoData}><MagicIcon /> Fill Demo Data</button>
          </div>

          <div className="tabs-nav">
            {['profile', 'experience', 'education', 'projects', 'skills', 'languages', 'design'].map(tab => (
              <button key={tab} className={`tab-pill ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="form-container">
            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="form-group slide-in">
                <label>Select Template Layout</label>
                <select className="premium-select" value={template} onChange={(e) => setTemplate(e.target.value)}>
                  <option value="modern">Modern (Colored Background Header)</option>
                  <option value="classic">Classic (Minimalist Text Header)</option>
                </select>

                <label>Choose Theme Color</label>
                <div className="color-picker-grid">
                  {presetColors.map(color => (
                    <div
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={`color-swatch ${themeColor === color ? 'active-swatch' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="form-group slide-in">
                <label>Full Name</label><input type="text" name="name" value={resumeData.profile.name} onChange={handleProfileChange} placeholder="e.g. Alex Johnson" />
                <div className="grid-2">
                  <div><label>Email</label><input type="email" name="email" value={resumeData.profile.email} onChange={handleProfileChange} placeholder="alex@email.com"/></div>
                  <div><label>Phone</label><input type="text" name="phone" value={resumeData.profile.phone} onChange={handleProfileChange} placeholder="+1 234 567 890"/></div>
                </div>
                <label>LinkedIn URL</label><input type="text" name="linkedin" value={resumeData.profile.linkedin} onChange={handleProfileChange} placeholder="linkedin.com/in/alex" />
                <label>Professional Summary</label><textarea rows="5" name="summary" value={resumeData.profile.summary} onChange={handleProfileChange} placeholder="A brief summary of your professional background..." />
              </div>
            )}

            {/* DYNAMIC TABS (Experience, Education, Projects) */}
            {['experience', 'education', 'projects'].includes(activeTab) && (
              <div className="list-group slide-in">
                {resumeData[activeTab].map(item => (
                  <div key={item.id} className="input-card">
                    <div className="card-top">
                      {/* Fixed Title Generation */}
                      <h4>{getSingularTabName(activeTab)} Entry</h4>
                      <button className="btn-icon-danger" onClick={() => removeItem(activeTab, item.id)} title="Remove"><TrashIcon /></button>
                    </div>

                    {activeTab === 'experience' && (
                      <>
                        <div className="grid-2">
                          <div><label>Job Title</label><input type="text" value={item.role} onChange={(e) => handleArrayChange('experience', item.id, 'role', e.target.value)} /></div>
                          <div><label>Company</label><input type="text" value={item.company} onChange={(e) => handleArrayChange('experience', item.id, 'company', e.target.value)} /></div>
                        </div>
                        <label>Duration</label><input type="text" value={item.duration} onChange={(e) => handleArrayChange('experience', item.id, 'duration', e.target.value)} placeholder="e.g. Jan 2020 - Present"/>
                        <label>Description</label><textarea rows="4" value={item.description} onChange={(e) => handleArrayChange('experience', item.id, 'description', e.target.value)} />
                      </>
                    )}

                    {activeTab === 'education' && (
                      <>
                        <label>School / University</label><input type="text" value={item.school} onChange={(e) => handleArrayChange('education', item.id, 'school', e.target.value)} />
                        <div className="grid-2">
                          <div><label>Degree</label><input type="text" value={item.degree} onChange={(e) => handleArrayChange('education', item.id, 'degree', e.target.value)} /></div>
                          <div><label>Graduation Year</label><input type="text" value={item.year} onChange={(e) => handleArrayChange('education', item.id, 'year', e.target.value)} /></div>
                        </div>
                      </>
                    )}

                    {activeTab === 'projects' && (
                      <>
                        <div className="grid-2">
                          <div><label>Project Name</label><input type="text" value={item.name} onChange={(e) => handleArrayChange('projects', item.id, 'name', e.target.value)} /></div>
                          <div><label>Link (Optional)</label><input type="text" value={item.link} onChange={(e) => handleArrayChange('projects', item.id, 'link', e.target.value)} /></div>
                        </div>
                        <label>Description</label><textarea rows="3" value={item.description} onChange={(e) => handleArrayChange('projects', item.id, 'description', e.target.value)} />
                      </>
                    )}
                  </div>
                ))}
                {/* Fixed Add Button Label */}
                <button className="btn-add-item" onClick={() => addItem(activeTab)}>
                  <PlusIcon /> Add {getSingularTabName(activeTab)}
                </button>
              </div>
            )}

            {/* SIMPLE ARRAY TABS (Skills, Languages) */}
            {['skills', 'languages'].includes(activeTab) && (
              <div className="list-group slide-in">
                <div className="skills-grid-input">
                  {resumeData[activeTab].map(entry => (
                    <div key={entry.id} className="skill-input-row">
                      {/* Fixed Placeholder Text */}
                      <input type="text" value={entry.name} onChange={(e) => handleArrayChange(activeTab, entry.id, 'name', e.target.value)} placeholder={`Enter ${getSingularTabName(activeTab)}...`} />
                      <button className="btn-icon-danger" onClick={() => removeItem(activeTab, entry.id)}><CloseIcon /></button>
                    </div>
                  ))}
                </div>
                {/* Fixed Add Button Label */}
                <button className="btn-add-item" onClick={() => addItem(activeTab)}>
                  <PlusIcon /> Add {getSingularTabName(activeTab)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: PREVIEW PANEL --- */}
        <div className="preview-panel">
          <div className="preview-toolbar">
            <span className="toolbar-title">Live Canvas</span>
            <div className="download-actions">
              <button className="btn-toolbar btn-analyze" onClick={openAnalysisModal} disabled={analyzing}>
                <SparkleIcon /> <span>AI Review</span>
              </button>
              <div className="divider-vertical"></div>
              <button className="btn-toolbar btn-pdf" onClick={downloadPDF} disabled={loading}>
                <DownloadIcon /> <span>PDF</span>
              </button>
              <button className="btn-toolbar btn-docx" onClick={downloadDOCX} disabled={loading}>
                {loading ? '...' : <><DownloadIcon /> <span>DOCX</span></>}
              </button>
            </div>
          </div>

          <div className="preview-scroll-area">
            {/* The actual A4 Resume Canvas */}
            <div className={`a4-paper template-${template}`} ref={resumeRef} style={{ padding: template === 'modern' ? '0' : '40px' }}>

              {/* Dynamic Header */}
              <div className="resume-header" style={{
                backgroundColor: template === 'modern' ? themeColor : 'transparent',
                color: template === 'modern' ? '#ffffff' : themeColor,
                padding: template === 'modern' ? '40px' : '0 0 20px 0',
                borderBottom: template === 'classic' ? `3px solid ${themeColor}` : 'none',
                textAlign: 'center'
              }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '28pt', fontWeight: 800, letterSpacing: '1px' }}>
                  {resumeData.profile.name || "YOUR NAME"}
                </h1>
                <div className="contact-info" style={{ color: template === 'modern' ? 'rgba(255,255,255,0.9)' : '#475569', fontSize: '10.5pt' }}>
                  {resumeData.profile.email && <span>{resumeData.profile.email}</span>}
                  {resumeData.profile.phone && <span> • {resumeData.profile.phone}</span>}
                  {resumeData.profile.linkedin && <span> • {resumeData.profile.linkedin}</span>}
                </div>
              </div>

              {/* Dynamic Body */}
              <div className="resume-body" style={{ padding: template === 'modern' ? '30px 40px' : '20px 0' }}>
                {resumeData.profile.summary && <p className="summary-text">{resumeData.profile.summary}</p>}

                {['Experience', 'Education', 'Projects', 'Skills', 'Languages'].map(sectionName => {
                  const dataKey = sectionName.toLowerCase();
                  if (resumeData[dataKey].length === 0) return null;

                  return (
                    <div key={sectionName} className="resume-section">
                      <h3 style={{ color: themeColor, borderBottom: `2px solid ${themeColor}` }}>{sectionName}</h3>

                      {(dataKey === 'skills' || dataKey === 'languages') ? (
                        <div className="skills-list">
                          {resumeData[dataKey].map(item => (
                            <span key={item.id} className="skill-badge-preview" style={{
                              backgroundColor: template === 'modern' ? `${themeColor}15` : '#f1f5f9',
                              color: template === 'modern' ? themeColor : '#334155'
                            }}>
                              {item.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        resumeData[dataKey].map(item => (
                          <div key={item.id} className="resume-item">
                            <div className="item-head">
                              <strong>{item.role || item.degree || item.name}</strong>
                              <span>{item.duration || item.year || item.link}</span>
                            </div>
                            <div className="item-subhead">{item.company || item.school}</div>
                            {item.description && <p>{item.description}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- AI ANALYSIS MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in-up">

            <div className="modal-header">
              <h2><SparkleIcon className="text-accent" /> AI Resume Review</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><CloseIcon /></button>
            </div>

            {/* STEP 1: ASK FOR JOB ROLE */}
            {!analyzing && !analysisResult ? (
              <div className="modal-step modal-target-job">
                <h3>Target Job Role</h3>
                <p>Gemini needs to know the position you are applying for to provide an accurate skill gap analysis.</p>
                <input
                  type="text"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                  placeholder="e.g. Senior Frontend Developer"
                  autoFocus
                />
                <button className="btn-primary-large" onClick={runAnalysis}>
                  <SparkleIcon /> Start Analysis
                </button>
              </div>

            // STEP 2: LOADING SCREEN
            ) : analyzing ? (
              <div className="modal-step modal-loading">
                <div className="spinner-glow"><SparkleIcon size={32} /></div>
                <p>Gemini is evaluating your resume against industry standards for <strong>{targetJob}</strong>...</p>
              </div>

            // STEP 3: RESULTS SCREEN
            ) : analysisResult ? (
              <div className="modal-results">
                <div className="score-container">
                  <div className={`score-circle ${analysisResult.score >= 75 ? 'score-high' : 'score-med'}`}>
                    {analysisResult.score}<span>/100</span>
                  </div>
                  <p>Match Score for {targetJob}</p>
                </div>

                <div className="ai-feedback-box">
                  {analysisResult.feedback_text}
                </div>

                <div className="feedback-grid">
                  <div className="feedback-card card-strengths">
                    <h4>🌟 Strengths</h4>
                    <ul>{analysisResult.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className="feedback-card card-gaps">
                    <h4>⚠️ Critical Gaps</h4>
                    <ul>{analysisResult.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul>
                  </div>
                </div>

                {analysisResult.learning_path?.length > 0 && (
                  <div className="learning-path-section">
                    <h3>Recommended Learning Path</h3>
                    <div className="learning-list">
                      {analysisResult.learning_path.map((course, idx) => (
                        <div key={idx} className="learning-item">
                          <div className="learning-header">
                            <strong>{course.course_name}</strong>
                            <span className="platform-tag">{course.platform}</span>
                          </div>
                          <p className="learning-desc">
                            <em>Target Skill: {course.skill}</em><br/>
                            {course.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn-secondary-large" onClick={() => setShowModal(false)}>Close Feedback</button>
              </div>
            ) : (
              <div className="modal-step"><p>Something went wrong loading the results.</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;