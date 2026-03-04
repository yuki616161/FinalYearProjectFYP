// src/components/AnalysisInspector.jsx
import React from 'react';

// --- ICONS ---
const CloseIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const FileIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'4px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

function AnalysisInspector({ user, history, onClose }) {
  // Defensive check: If no user or history is passed, do not render the modal
  if (!user) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>

      <div style={{
        backgroundColor: '#ffffff', width: '90%', maxWidth: '800px',
        maxHeight: '85vh', borderRadius: '16px', overflowY: 'auto',
        padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>

        {/* CLOSE BUTTON */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
        }}>
          <CloseIcon />
        </button>

        {/* MODAL HEADER */}
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <h2 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>
            Analysis Report
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            Student: {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.name || "Unknown"}
          </p>
        </div>

        {/* EMPTY STATE */}
        {(!history || history.length === 0) ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
            <p>No analysis data found for this record.</p>
          </div>
        ) : (

          /* HISTORY RECORD(S) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {history.map((record, index) => (
              <div key={record.id || index} style={{
                border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#f8fafc'
              }}>

                {/* RECORD HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '1.2rem' }}>
                      Target: {record.target_role || 'General Application'}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                      <FileIcon /> {record.file_name || "Resume File"} • {record.created_at ? new Date(record.created_at).toLocaleDateString() : "Recent Scan"}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: record.score >= 70 ? '#dcfce7' : '#fee2e2',
                    color: record.score >= 70 ? '#166534' : '#991b1b',
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
                    border: `1px solid ${record.score >= 70 ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    {record.score || 0}% Match
                  </div>
                </div>

                {/* SKILLS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                  {/* STRENGTHS */}
                  <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓</span> Identified Strengths
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {record.strengths && record.strengths.length > 0 ? (
                        record.strengths.map((s, i) => (
                          <span key={i} style={{ background: '#f0fdf4', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>No specific strengths detected.</span>
                      )}
                    </div>
                  </div>

                  {/* GAPS */}
                  <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚠</span> Missing Skills (Gaps)
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {record.gaps && record.gaps.length > 0 ? (
                        record.gaps.map((g, i) => (
                          <span key={i} style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {g}
                          </span>
                        ))
                      ) : (
                        <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>No critical gaps detected.</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* AI RECOMMENDATIONS */}
                {record.recommendations && (
                  <div style={{ marginTop: '20px', background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>AI Feedback</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                      {record.recommendations}
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisInspector;