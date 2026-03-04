// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import DashboardNavbar from "../components/DashboardNavbar";

// --- ICONS ---
const UploadCloudIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><path d="M16 16l-4-4-4 4"/></svg>;
const FileTextIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const HistoryIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const TargetIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const SparkleIcon = () => <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertTriangleIcon = () => <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", job: "" });
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      // Fetch both first and last name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, preferred_job')
        .eq('id', user.id)
        .single();

      if (profileData) {
        // Combine names safely
        const fName = profileData.first_name || "";
        const lName = profileData.last_name || "";
        const fullName = `${fName} ${lName}`.trim() || "Student"; // Fallback if both are empty

        setProfile({
          name: fullName,
          job: profileData.preferred_job || "General Jobseeker"
        });
      }

      const { data: historyData } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (historyData && historyData.length > 0) setLatestScan(historyData[0]);

    } catch (err) {
      console.error("Error fetching user data:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- MATH FOR SVG CHART ---
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const score = latestScan?.score || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const getChartColor = (s) => s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-800 flex flex-col items-center">
      <DashboardNavbar />

      {/* INJECT CUSTOM ANIMATION FOR THE RESUME SCANNER */}
      <style>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}</style>

      <main className="w-full max-w-7xl mx-auto px-6 py-10 lg:px-8">

        {/* --- RESUME THEMED HERO BANNER --- */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-10 md:p-14 text-white shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>

          <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
            <div className="inline-block bg-blue-500/20 text-blue-300 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-500/30">
              InsightResume Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              Ready to optimize your <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">career profile</span>, {profile.name}?
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-300 text-lg">
              <TargetIcon /> Target Role: <span className="text-white font-semibold border-b border-blue-400">{profile.job}</span>
            </div>
          </div>

          {/* VISUAL ELEMENT: The Animated Resume Scanner */}
          <div className="relative z-10 w-48 h-60 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 shadow-2xl hidden md:flex flex-col transform rotate-3 hover:rotate-0 transition-transform duration-500 flex-shrink-0">
            {/* Fake Resume Content */}
            <div className="w-1/2 h-3 bg-blue-400/80 rounded mb-4"></div>
            <div className="w-full h-1.5 bg-slate-400/40 rounded mb-2"></div>
            <div className="w-5/6 h-1.5 bg-slate-400/40 rounded mb-6"></div>

            <div className="w-1/3 h-2 bg-blue-400/60 rounded mb-3"></div>
            <div className="w-full h-1.5 bg-slate-400/30 rounded mb-1.5"></div>
            <div className="w-full h-1.5 bg-slate-400/30 rounded mb-1.5"></div>
            <div className="w-4/5 h-1.5 bg-slate-400/30 rounded mb-6"></div>

            <div className="flex gap-2 mt-auto">
              <div className="w-8 h-8 rounded bg-slate-400/20"></div>
              <div className="w-8 h-8 rounded bg-slate-400/20"></div>
            </div>

            {/* Glowing Scan Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_15px_3px_rgba(96,165,250,0.6)] animate-scan z-20"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-slate-500">
             <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* --- QUICK ACTIONS (Document Folder Style) --- */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Workspace</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

              <Link to="/resume-analysis" className="no-underline hover:no-underline group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <UploadCloudIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyze Document</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Scan your PDF against ATS criteria to uncover missing keywords.</p>
              </Link>

              <Link to="/resume-builder" className="no-underline hover:no-underline group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileTextIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resume Editor</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Draft your content on a live A4 layout designed for high readability.</p>
              </Link>

              <Link to="/history" className="no-underline hover:no-underline group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <HistoryIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Version History</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Compare your past resume scores and track your improvements.</p>
              </Link>
            </div>

            {/* --- AI INSIGHTS BENTO BOX --- */}
            <div className="flex items-center gap-3 mb-6">
              <SparkleIcon />
              <h2 className="text-2xl font-bold text-slate-900">Latest Document Insights</h2>
            </div>

            {latestScan ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Score Circular Chart */}
                <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-8">ATS Match Score</p>

                  <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r={radius} className="stroke-slate-100" strokeWidth="12" fill="none" />
                      <circle
                        cx="80" cy="80" r={radius}
                        className={`${getChartColor(score)} transition-all duration-1000 ease-out`}
                        strokeWidth="12" fill="none" strokeLinecap="round" stroke="currentColor"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-black text-slate-900">{score}<span className="text-2xl text-slate-400">%</span></span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-base">Targeting:<br/><span className="font-bold text-slate-900 mt-2 block text-lg">{latestScan.target_role}</span></p>
                </div>

                {/* AI Document Annotations (Paper-like feel) */}
                <div className="lg:col-span-2 bg-[#fdfbf7] rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle paper lines background */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,_#e2e8f0_95%)] bg-[length:100%_30px] opacity-20 pointer-events-none"></div>

                  <div className="relative z-10 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <AlertTriangleIcon /> Missing Keywords Detected
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {latestScan.gaps && latestScan.gaps.length > 0 ? (
                        latestScan.gaps.map((gap, i) => (
                          <span key={i} className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm inline-block">
                            + {gap}
                          </span>
                        ))
                      ) : (
                        <span className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-100">
                          <CheckCircleIcon /> Document contains all primary keywords!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Editor's Note styling */}
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-violet-500 shadow-sm mt-auto">
                    <h4 className="flex items-center gap-2 text-violet-900 font-bold mb-3 text-sm uppercase tracking-wide">
                      <SparkleIcon /> Editor's Note (AI)
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-base font-medium">
                      {latestScan.recommendations || "Incorporate the missing keywords above into your Experience descriptions to increase your ATS compatibility."}
                    </p>
                  </div>

                </div>
              </div>

            ) : (

              /* --- EMPTY STATE (Resume Outline View) --- */
              <div className="relative bg-[#fdfbf7] rounded-3xl p-16 border border-slate-200 shadow-sm overflow-hidden group cursor-pointer text-center" onClick={() => navigate('/analyzer')}>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center transition-all duration-300">
                  <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 shadow-xl group-hover:-translate-y-2 transition-transform duration-300">
                    <UploadCloudIcon />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Upload Your Resume</h3>
                  <p className="text-slate-600 font-medium text-lg mb-8 max-w-md mx-auto">Let the AI scan your document and highlight areas for improvement.</p>
                  <span className="text-blue-600 font-bold text-lg group-hover:underline">Get Started →</span>
                </div>

                {/* Faded Background Mock Data */}
                <div className="opacity-30 filter grayscale pointer-events-none">
                  <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 p-12 shadow-sm rounded-lg">
                    <div className="w-1/3 h-8 bg-slate-300 mx-auto mb-4 rounded"></div>
                    <div className="w-1/2 h-4 bg-slate-200 mx-auto mb-10 rounded"></div>
                    <div className="w-full h-5 bg-slate-200 mb-3 rounded"></div>
                    <div className="w-5/6 h-5 bg-slate-200 mb-8 rounded"></div>
                    <div className="w-1/4 h-6 bg-slate-300 mb-5 rounded"></div>
                    <div className="w-full h-5 bg-slate-200 mb-3 rounded"></div>
                    <div className="w-full h-5 bg-slate-200 mb-3 rounded"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;