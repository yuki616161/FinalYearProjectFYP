// src/pages/CareerPath.jsx
import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import '../css/CareerPath.css';

// Icons
const CheckCircle = () => <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>;
const LockIcon = () => <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 11H6v-6h12v6z"/></svg>;
const PlayIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6z"/></svg>;

function CareerPath() {
  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <main className="main-content">

        {/* HEADER */}
        <div className="path-header">
          <div>
            <div className="badge-target">Target Role</div>
            <h1>Software Engineer Roadmap</h1>
            <p>You are an <strong>85% match</strong> for Junior Roles. Here is how to reach Senior Level.</p>
          </div>

          <div className="progress-card">
            <div className="progress-info">
              <span>Current Progress</span>
              <span className="percent">3/5 Modules</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>

        {/* ROADMAP CONTAINER */}
        <div className="roadmap-container">

          {/* STEP 1: COMPLETED */}
          <div className="roadmap-step completed">
            <div className="step-marker">
              <CheckCircle />
              <div className="line"></div>
            </div>
            <div className="step-content">
              <h3>Computer Science Fundamentals</h3>
              <p>Great job! Your resume indicates strong knowledge in Algorithms and Data Structures.</p>
              <div className="skills-row">
                <span className="skill-pill done">Java</span>
                <span className="skill-pill done">C++</span>
                <span className="skill-pill done">OOP</span>
              </div>
            </div>
          </div>

          {/* STEP 2: IN PROGRESS (The Gap) */}
          <div className="roadmap-step active">
            <div className="step-marker">
              <div className="circle-active">2</div>
              <div className="line dashed"></div>
            </div>
            <div className="step-content highlight-step">
              <div className="gap-alert">⚠️ Skill Gap Detected</div>
              <h3>Modern Web Development</h3>
              <p>Market trends show high demand for <strong>React</strong> and <strong>Cloud</strong> skills which are missing from your profile.</p>

              {/* Recommended Course Card */}
              <div className="course-recommendation">
                <div className="course-image"></div>
                <div className="course-details">
                  <h4>Full Stack React & Cloud</h4>
                  <span>Recommended • 4 Weeks • Intermediate</span>
                </div>
                <button className="btn-start">
                  <PlayIcon /> Start Learning
                </button>
              </div>

              <div className="skills-row">
                <span className="skill-pill missing">React.js</span>
                <span className="skill-pill missing">AWS</span>
                <span className="skill-pill missing">Docker</span>
              </div>
            </div>
          </div>

          {/* STEP 3: LOCKED */}
          <div className="roadmap-step locked">
            <div className="step-marker">
              <div className="circle-locked"><LockIcon /></div>
            </div>
            <div className="step-content">
              <h3>System Design & Architecture</h3>
              <p>Unlock this module after completing Web Development.</p>
              <div className="skills-row">
                <span className="skill-pill locked">Microservices</span>
                <span className="skill-pill locked">Scalability</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default CareerPath;