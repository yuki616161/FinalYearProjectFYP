import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/Profile.css";

// --- ICONS ---
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>;
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

function Profile() {
  const [user, setUser] = useState({
    name: "Yon Yu Ki",
    title: "Software Engineer",
    email: "yonyuki@example.com",
    phone: "+60 12-345 6789",
    location: "Kedah, Malaysia",
    bio: "Passionate about building scalable web applications and AI tools. Open to internships.",
    avatar: "YY"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar />

      <div className="profile-page">

        {/* PAGE HEADER */}
        <div className="page-header-simple">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile details and personal information.</p>
          </div>
          <button
            className={`btn-header ${isEditing ? 'btn-save-mode' : ''}`}
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          >
            {isEditing ? <><SaveIcon /> Save Changes</> : <><EditIcon /> Edit Profile</>}
          </button>
        </div>

        <div className="profile-split-layout">

          {/* LEFT: THE "BUSINESS CARD" (Visual Preview) */}
          <aside className="profile-sidebar">
            <div className="user-card-static">
              <div className="avatar-big">{user.avatar}</div>
              <h2 className="static-name">{user.name}</h2>
              <p className="static-role">{user.title}</p>

              <div className="static-meta">
                <div className="meta-row">
                  <MapIcon /> <span>{user.location}</span>
                </div>
                <div className="meta-row">
                  <MailIcon /> <span>{user.email}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: THE FORM (Editable Area) */}
          <main className="profile-form-area">
            <form onSubmit={handleSave}>

              {/* SECTION 1: IDENTITY */}
              <div className="form-section">
                <h3>Public Profile</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Display Name</label>
                    <div className="input-wrap">
                      <UserIcon />
                      <input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Job Title / Role</label>
                    <input
                      name="title"
                      value={user.title}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      rows="3"
                      value={user.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="helper-text">Brief description for your profile.</span>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* SECTION 2: CONTACT */}
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <MailIcon />
                      <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrap">
                      <PhoneIcon />
                      <input
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <div className="input-wrap">
                      <MapIcon />
                      <input
                        name="location"
                        value={user.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
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