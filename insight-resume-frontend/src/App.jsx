import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- IMPORT GLOBAL STYLES ---
import './App.css';

// --- IMPORT PAGES ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';

// --- LAYOUT HELPER COMPONENT ---
// This component handles the conditional styling based on the route
const AppContent = () => {
  const location = useLocation();

  // Check if the current path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    // If it's an Admin route, use a full-width container (or no class).
    // If it's a User route, keep the original "app-container".
    <div className={isAdminRoute ? "full-width-container" : "app-container"}>
      <Routes>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- DASHBOARD & OVERVIEW --- */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* --- CORE FEATURES --- */}
        <Route path="/resume-analysis" element={<ResumeAnalyzer />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />

        {/* --- ADMIN ROUTE --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* --- 404 FALLBACK --- */}
        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;