// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Auth.css'; // Make sure this path points to your CSS file

// --- ICONS ---
const UserIcon = () => (<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const MailIcon = () => (<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const LockIcon = () => (<svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const EyeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const EyeOffIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Calculate Password Strength (0-4)
  const strength = (() => {
    const p = formData.password;
    let s = 0;
    if (p.length > 5) s++;
    if (p.length > 7) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    return s;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // Simple Validation
    if (password.length < 8) { setError("Password must be 8+ chars."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match!"); return; }

    // Simulate API Call
    setIsLoading(true);
    setTimeout(() => {
      // alert("Success!");
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="auth-page">
      {/* 1. Background Layers (Fixes the white space issue) */}
      <div className="grid-background"></div>
      <div className="bg-blob blob-purple"></div>
      <div className="bg-blob blob-indigo"></div>

      {/* 2. The Centered Glass Card */}
      <div className="auth-card">

        {/* Logo */}
        <div className="brand-logo">
          <div className="logo-circle">IR</div>
        </div>

        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start your journey to a better career.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input type="text" name="name" placeholder="Yon Yu Ki" onChange={handleChange} required />
              <UserIcon />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input type="email" name="email" placeholder="student@uum.edu.my" onChange={handleChange} required />
              <MailIcon />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <LockIcon />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Password Strength Bar */}
            <div className="strength-meter">
              <div className={`bar ${strength > 0 ? 'filled' : ''}`}></div>
              <div className={`bar ${strength > 1 ? 'filled' : ''}`}></div>
              <div className={`bar ${strength > 2 ? 'filled' : ''}`}></div>
              <div className={`bar ${strength > 3 ? 'filled' : ''}`}></div>
            </div>
            <p className="strength-text">
              {strength < 2 ? "Weak" : strength < 4 ? "Medium" : "Strong"}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <LockIcon />
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="error-box">⚠️ {error}</div>}

          {/* Submit Button */}
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;