// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/Profile.css";
import { supabase } from '../supabaseClient';

// --- ICONS ---
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>;
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const LinkedinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const GithubIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;

function Profile() {
  const [user, setUser] = useState({
    id: "", name: "", role: "", preferred_job: "", experience_level: "Fresh Graduate",
    email: "", phone: "", location: "", bio: "", linkedin_url: "", github_url: "", avatar: "U"
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (authUser) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setUser({
          id: authUser.id,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          role: data.role || "Jobseeker",
          preferred_job: data.preferred_job || "",
          experience_level: data.experience_level || "Fresh Graduate",
          email: authUser.email,
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          avatar: data.first_name ? data.first_name.charAt(0).toUpperCase() : "U"
        });
      }
    }
  }

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          preferred_job: user.preferred_job,
          experience_level: user.experience_level,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          linkedin_url: user.linkedin_url,
          github_url: user.github_url
        })
        .eq('id', user.id);

      if (error) throw error;
      setIsEditing(false);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile", error.message);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <div className="profile-page">
        <div className="page-header-simple">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile details and personal information.</p>
          </div>
          <button
            className={`btn-header ${isEditing ? 'btn-save-mode' : ''}`}
            onClick={(e) => isEditing ? handleSave(e) : setIsEditing(true)}
          >
            {isEditing ? <><SaveIcon /> Save Changes</> : <><EditIcon /> Edit Profile</>}
          </button>
        </div>

        <div className="profile-split-layout">
          <aside className="profile-sidebar">
            <div className="user-card-static">
              <div className="avatar-big">{user.avatar}</div>
              <h2 className="static-name">{user.name || "User Name"}</h2>
              <p className="static-role">{user.preferred_job || user.role}</p>

              <span style={{ fontSize: '0.8rem', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '12px', marginTop: '5px', display: 'inline-block', fontWeight: 'bold' }}>
                {user.experience_level}
              </span>

              <div className="static-meta" style={{ marginTop: '20px' }}>
                <div className="meta-row">
                  <MapIcon /> <span>{user.location || "Location not set"}</span>
                </div>
                <div className="meta-row">
                  <MailIcon /> <span>{user.email}</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="profile-form-area">
            <form onSubmit={handleSave}>
              <div className="form-section">
                <h3>Public Profile</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Display Name</label>
                    <div className="input-wrap">
                      <UserIcon />
                      <input name="name" value={user.name} onChange={handleChange} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Account Role 🔒</label>
                    <input name="role" value={user.role} disabled={true} style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }} />
                  </div>
                  <div className="form-group">
                    <label>Target Job / Preferred Role</label>
                    <input name="preferred_job" value={user.preferred_job} onChange={handleChange} disabled={!isEditing} placeholder="e.g., Frontend Developer" />
                  </div>
                  <div className="form-group">
                    <label>Experience Level</label>
                    <select name="experience_level" value={user.experience_level} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                      <option value="Student / Internship">Student / Internship</option>
                      <option value="Fresh Graduate">Fresh Graduate</option>
                      <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                      <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                      <option value="Senior (5+ years)">Senior (5+ years)</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea name="bio" rows="3" value={user.bio} onChange={handleChange} disabled={!isEditing} />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <MailIcon />
                      <input name="email" value={user.email} disabled={true} style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrap">
                      <PhoneIcon />
                      <input name="phone" value={user.phone} onChange={handleChange} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-wrap">
                      <MapIcon />
                      <input name="location" value={user.location} onChange={handleChange} disabled={!isEditing} />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="form-section">
                <h3>Professional Links</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <div className="input-wrap">
                      <LinkedinIcon />
                      <input name="linkedin_url" value={user.linkedin_url} onChange={handleChange} disabled={!isEditing} placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>GitHub / Portfolio URL</label>
                    <div className="input-wrap">
                      <GithubIcon />
                      <input name="github_url" value={user.github_url} onChange={handleChange} disabled={!isEditing} placeholder="https://github.com/username" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;