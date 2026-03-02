// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure this path is correct!
import '../css/Auth.css';

// --- ICONS ---
const MailIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const LockIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing again
  };

  // ---> THIS IS THE UPDATED LOGIN LOGIC <---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Log in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Fetch the user's role from the 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Save the role to localStorage so your Navbar and other pages know who is logged in
      localStorage.setItem('userRole', profileData.role);

      // 4. Redirect them to the correct dashboard based on their role!
      if (profileData.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* 1. Grid Background */}
      <div className="grid-background"></div>

      {/* 2. The White Card */}
      <div className="auth-card">

        {/* Logo Box */}
        <div className="brand-logo">
          <div className="logo-circle">IR</div>
        </div>

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="student@uum.edu.my"
                onChange={handleChange}
                required
              />
              <MailIcon />
            </div>
          </div>

          {/* Password Input */}
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

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Error Message Display */}
          {error && <div className="error-box" style={{color: '#dc2626', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', fontWeight: '600'}}>
            ⚠️ {error}
          </div>}

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Get Started</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;