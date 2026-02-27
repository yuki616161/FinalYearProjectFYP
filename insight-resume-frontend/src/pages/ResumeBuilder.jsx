import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/ResumeBuilder.css";

// --- ICONS ---
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const MagicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 21v-8"/><path d="m7 8 4-4 4 4"/><path d="M11 4v8"/><path d="M5 12h14"/><path d="m16 9-2.5 2.5-2.5-2.5"/><path d="m11 15 2.5-2.5 2.5 2.5"/></svg>;

function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [resumeData, setResumeData] = useState({
    profile: { name: "", email: "", phone: "", linkedin: "", summary: "" },
    experience: [],
    education: [],
    skills: []
  });

  const loadDemoData = () => {
    setResumeData({
      profile: {
        name: "ALEX JOHNSON",
        email: "alex.j@example.com",
        phone: "+60 12-345 6789",
        linkedin: "linkedin.com/in/alexj",
        summary: "Motivated Software Engineer with 3+ years of experience in building scalable web applications. Passionate about cloud computing and AI solutions."
      },
      experience: [
        { id: 1, role: "Frontend Developer", company: "TechNova", duration: "2021 - Present", description: "Built responsive UI using React.js and reduced page load time by 30%." },
        { id: 2, role: "Intern", company: "StartUp Inc", duration: "2020 - 2021", description: "Assisted in debugging backend APIs and writing unit tests." }
      ],
      education: [
        { id: 1, school: "University of Malaya", degree: "BSc Computer Science", year: "2021" }
      ],
      skills: [
        { id: 1, name: "React.js" },
        { id: 2, name: "Python" },
        { id: 3, name: "Docker" }
      ]
    });
  };

  const handleProfileChange = (e) => setResumeData({ ...resumeData, profile: { ...resumeData.profile, [e.target.name]: e.target.value } });
  
  const handleArrayChange = (section, id, field, value) => {
    const updated = resumeData[section].map(item => item.id === id ? { ...item, [field]: value } : item);
    setResumeData({ ...resumeData, [section]: updated });
  };

  const addItem = (section) => setResumeData({ ...resumeData, [section]: [...resumeData[section], { id: Date.now(), role: "", company: "", school: "", name: "" }] });
  
  const removeItem = (section, id) => setResumeData({ ...resumeData, [section]: resumeData[section].filter(item => item.id !== id) });

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resumeData.profile.name.replace(/\s+/g, '_')}_Resume.docx`;
        a.click();
      } else { alert("Failed to generate resume."); }
    } catch (e) { alert("Error connecting to server."); } finally { setLoading(false); }
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <div className="builder-wrapper">
        
        {/* --- LEFT: EDITOR --- */}
        <div className="editor-panel">
          <div className="editor-header">
            <h2>Resume Editor</h2>
            <button className="btn-demo" onClick={loadDemoData}><MagicIcon /> Demo Data</button>
          </div>

          <div className="tabs-nav">
            {['profile', 'experience', 'education', 'skills'].map(tab => (
              <button key={tab} className={`tab-pill ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="form-container">
            {activeTab === 'profile' && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={resumeData.profile.name} onChange={handleProfileChange} placeholder="ALEX JOHNSON" />
                <div className="grid-2">
                  <div><label>Email</label><input type="email" name="email" value={resumeData.profile.email} onChange={handleProfileChange} /></div>
                  <div><label>Phone</label><input type="text" name="phone" value={resumeData.profile.phone} onChange={handleProfileChange} /></div>
                </div>
                <label>LinkedIn</label><input type="text" name="linkedin" value={resumeData.profile.linkedin} onChange={handleProfileChange} />
                <label>Summary</label><textarea rows="4" name="summary" value={resumeData.profile.summary} onChange={handleProfileChange} />
              </div>
            )}

            {(activeTab === 'experience' || activeTab === 'education') && (
              <div className="list-group">
                {resumeData[activeTab].map(item => (
                  <div key={item.id} className="input-card">
                    <div className="card-top">
                      <h4>{activeTab === 'experience' ? 'Position' : 'School'}</h4>
                      <button className="btn-icon-danger" onClick={() => removeItem(activeTab, item.id)}><TrashIcon /></button>
                    </div>
                    {activeTab === 'experience' ? (
                      <>
                        <input type="text" placeholder="Job Title" value={item.role} onChange={(e) => handleArrayChange('experience', item.id, 'role', e.target.value)} />
                        <input type="text" placeholder="Company" value={item.company} onChange={(e) => handleArrayChange('experience', item.id, 'company', e.target.value)} />
                        <input type="text" placeholder="Duration" value={item.duration} onChange={(e) => handleArrayChange('experience', item.id, 'duration', e.target.value)} />
                        <textarea placeholder="Description" rows="3" value={item.description} onChange={(e) => handleArrayChange('experience', item.id, 'description', e.target.value)} />
                      </>
                    ) : (
                      <>
                        <input type="text" placeholder="Degree" value={item.degree} onChange={(e) => handleArrayChange('education', item.id, 'degree', e.target.value)} />
                        <input type="text" placeholder="School" value={item.school} onChange={(e) => handleArrayChange('education', item.id, 'school', e.target.value)} />
                        <input type="text" placeholder="Year" value={item.year} onChange={(e) => handleArrayChange('education', item.id, 'year', e.target.value)} />
                      </>
                    )}
                  </div>
                ))}
                <button className="btn-add-item" onClick={() => addItem(activeTab)}><PlusIcon /> Add Item</button>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="list-group">
                <div className="skills-grid-input">
                  {resumeData.skills.map(skill => (
                    <div key={skill.id} className="skill-input-row">
                      <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => handleArrayChange('skills', skill.id, 'name', e.target.value)} />
                      <button className="btn-icon-danger" onClick={() => removeItem('skills', skill.id)}>×</button>
                    </div>
                  ))}
                </div>
                <button className="btn-add-item" onClick={() => addItem('skills')}><PlusIcon /> Add Skill</button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: PREVIEW --- */}
        <div className="preview-panel">
          <div className="preview-toolbar">
            <span>Live Preview (A4)</span>
            <button className="btn-download" onClick={handleDownload} disabled={loading}>
              {loading ? 'Generating...' : <><DownloadIcon /> Download DOCX</>}
            </button>
          </div>
          
          <div className="a4-paper">
            <div className="resume-header">
              <h1>{resumeData.profile.name || "YOUR NAME"}</h1>
              <div className="contact-info">
                {resumeData.profile.email && <span>{resumeData.profile.email}</span>}
                {resumeData.profile.phone && <span> • {resumeData.profile.phone}</span>}
                {resumeData.profile.linkedin && <span> • {resumeData.profile.linkedin}</span>}
              </div>
            </div>

            <div className="resume-body">
              {resumeData.profile.summary && <p className="summary-text">{resumeData.profile.summary}</p>}

              {resumeData.experience.length > 0 && (
                <div className="resume-section">
                  <h3>Experience</h3>
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} className="resume-item">
                      <div className="item-head"><strong>{exp.role}</strong><span>{exp.company} | {exp.duration}</span></div>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="resume-section">
                  <h3>Education</h3>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="resume-item">
                      <div className="item-head"><strong>{edu.degree}</strong><span>{edu.year}</span></div>
                      <p>{edu.school}</p>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div className="resume-section">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {resumeData.skills.map(s => <span key={s.id} className="skill-badge-preview">{s.name}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResumeBuilder;