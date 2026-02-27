import React from 'react';
import '../css/AnalysisInspector.css';

// Icons
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const BrainIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const AnalysisInspector = ({ user, history, onClose }) => {
  if (!user || !history) return null;

  return (
    <div className="inspector-overlay">
      <div className="inspector-panel slide-in">

        {/* HEADER */}
        <div className="inspector-header">
          <div>
            <h2 className="inspector-title">
              <BrainIcon /> NLP Analysis Log
            </h2>
            <p className="inspector-subtitle">
              Inspecting activity for <span className="highlight">{user.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="btn-close-inspector"><CloseIcon /></button>
        </div>

        {/* CONTENT SCROLL AREA */}
        <div className="inspector-body">
          {history.length === 0 ? (
            <div className="empty-state">No analysis history found.</div>
          ) : (
            <div className="timeline">
              {history.map((record) => (
                <div key={record.id} className="timeline-item">

                  {/* Timeline Date */}
                  <div className="timeline-marker"></div>
                  <div className="record-date">
                    <CalendarIcon /> {record.date}
                  </div>

                  {/* The Analysis Card */}
                  <div className="record-card">

                    {/* Top Row: Job Role & Score */}
                    <div className="record-header-row">
                      <div className="job-role-tag">
                        <span className="label">Target Role</span>
                        <span className="value">{record.job_role}</span>
                      </div>
                      <div className={`score-circle ${record.score >= 70 ? 'good' : 'average'}`}>
                        {record.score}
                        <span className="score-label">Match</span>
                      </div>
                    </div>

                    <div className="divider-dashed"></div>

                    {/* Extracted Data Section (Requirement 10.3) */}
                    <div className="extracted-data-section">
                      <h4>⚡ Extracted NLP Data</h4>

                      {/* Skills Grid */}
                      <div className="data-group">
                        <label>Detected Skills:</label>
                        <div className="skills-cloud">
                          {record.extracted_skills.split(', ').map((skill, i) => (
                            <span key={i} className="skill-chip">{skill}</span>
                          ))}
                        </div>
                      </div>

                      {/* Education (If available) */}
                      {record.education && (
                        <div className="data-group">
                          <label>Education Parsed:</label>
                          <div className="education-box">{record.education}</div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="inspector-footer">
          <button className="btn-secondary" onClick={onClose}>Close Inspector</button>
        </div>

      </div>
    </div>
  );
};

export default AnalysisInspector;