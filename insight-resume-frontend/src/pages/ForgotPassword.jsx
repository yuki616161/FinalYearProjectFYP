import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Auth.css'; // Uses the same shared CSS

// --- ICONS ---
const MailIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false); // State to show success message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    setIsSent(true);

    // Optional: Redirect after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 4000);
  };

  return (
    <div className="auth-page">
      {/* 1. BACKGROUND LAYERS (Matches Login/Signup) */}
      <div className="grid-background"></div>
      <div className="bg-blob blob-purple"></div>
      <div className="bg-blob blob-indigo"></div>

      {/* 2. CENTERED GLASS CARD */}
      <div className="auth-card">

        {/* LOGO */}
        <div className="brand-logo">
          <div className="logo-circle">IR</div>
        </div>

        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Don't worry, it happens to the best of us.</p>
        </div>

        {!isSent ? (
          /* --- FORM STATE --- */
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="student@uum.edu.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MailIcon />
              </div>
            </div>

            <button type="submit" className="auth-btn">Send Reset Link</button>
          </form>
        ) : (
          /* --- SUCCESS STATE --- */
          <div className="success-message" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '60px', height: '60px', background: '#dcfce7', color: '#10b981',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto', fontSize: '1.5rem'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem' }}>Check your email</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              We have sent a password reset link to <br/><strong>{email}</strong>
            </p>
          </div>
        )}

        <div className="auth-footer">
          <span style={{color: '#94a3b8'}}>Remember your password?</span> <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;