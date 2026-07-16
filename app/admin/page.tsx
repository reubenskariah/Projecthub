'use client';

import React, { useState, useEffect } from 'react';
import { fetchPendingProjects, fetchAllProjects, approveProjectCall, deleteProjectCall } from '@/app/actions/projectActions';

interface Applicant {
  id?: string;
  project_id: string;
  name: string;
  dept_sem: string;
  linkedin_url: string;
  status: 'confirmed' | 'waitlist';
  created_at?: string;
}

interface Project {
  id: string;
  title: string;
  abstract: string;
  caller_name: string;
  caller_dept: string;
  slots_needed: number;
  review_days: number;
  expires_at: string;
  keywords: string[];
  status: string;
  created_at: string;
  applicants?: Applicant[];
}

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);

  // Dashboard views: 'queue' (pending) or 'directory' (all/active)
  const [adminTab, setAdminTab] = useState<'queue' | 'directory'>('queue');
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check sessionStorage auth on mount to avoid SSR hydration mismatches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('iykyk_admin_auth');
      if (auth === 'true') {
        setIsAdminLoggedIn(true);
      }
      setCheckingAuth(false);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const pendingRes = await fetchPendingProjects();
    const allRes = await fetchAllProjects();
    
    if (pendingRes.success && pendingRes.data) {
      setPendingProjects(pendingRes.data as Project[]);
    }
    if (allRes.success && allRes.data) {
      setAllProjects(allRes.data as Project[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Authorization
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'iykyk' && adminPass === 'iykyk@things') {
      setIsAdminLoggedIn(true);
      setAdminError(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('iykyk_admin_auth', 'true');
      }
    } else {
      setAdminError(true);
    }
  };

  const handleSignOut = () => {
    setIsAdminLoggedIn(false);
    setAdminUser('');
    setAdminPass('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('iykyk_admin_auth');
    }
  };

  // Action: Approve Project Call
  const handleApprove = async (projectId: string) => {
    setActionMessage(null);
    const res = await approveProjectCall(projectId);
    if (res.success) {
      setActionMessage({ type: 'success', text: 'Project call approved and pushed live to feed!' });
      loadData();
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Failed to approve project call.' });
    }
  };

  // Action: Delete Project Call
  const handleDelete = async (projectId: string) => {
    setActionMessage(null);
    const confirmDelete = window.confirm('Are you sure you want to delete this project call? This will remove all applications.');
    if (!confirmDelete) return;

    const res = await deleteProjectCall(projectId);
    if (res.success) {
      setActionMessage({ type: 'success', text: 'Project call and related applicants successfully deleted.' });
      loadData();
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Failed to delete project call.' });
    }
  };

  if (checkingAuth) {
    return (
      <div className="empty-state text-center font-mono text-sm py-16 text-[#4a6178]">
        Checking authentication state...
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand cursor-default">
            <svg style={{ height: '38px', width: 'auto', display: 'block' }} viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M45 40 L75 40" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                <path d="M45 75 L75 75" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <path d="M45 40 L45 75" stroke="#eef2ee" strokeWidth="6" strokeLinecap="round" />
                <path 
                  d="M45 25 C75 25, 85 40, 85 50 C85 60, 75 70, 45 70" 
                  stroke="#2563EB" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <circle cx="45" cy="40" r="8" fill="#eef2ee" />
                <circle cx="75" cy="40" r="8" fill="#2563EB" />
                <circle cx="45" cy="75" r="8" fill="#94A3B8" />
                <circle cx="75" cy="75" r="5" fill="#38BDF8" />
              </g>
              <text 
                x="110" 
                y="72" 
                fill="#eef2ee" 
                fontFamily="var(--sans)" 
                fontWeight="800" 
                fontSize="64" 
                letterSpacing="-1"
              >
                project<tspan fill="#2563EB" fontWeight="900">hub</tspan>
              </text>
            </svg>
          </div>
          
          {isAdminLoggedIn && (
            <nav className="top-actions">
              <button onClick={handleSignOut} className="btn btn-ghost btn-sm font-semibold cursor-pointer">
                Sign Out
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Admin banner in admin portal */}
      <div className="admin-banner show">ADMIN MODE — reviewing pending calls before they reach the feed</div>

      <div className="page-view active-view" style={{ minHeight: '80vh', paddingBottom: '60px' }}>
        
        {/* LOGIN SCREEN */}
        {!isAdminLoggedIn ? (
          <div id="adminLoginArea" style={{ maxWidth: '450px', margin: '60px auto', padding: '0 16px' }}>
            <div className="titleblock" style={{ display: 'block', marginBottom: '24px', border: '1.5px solid var(--blue-deep)', background: 'var(--white)', borderRadius: 'var(--radius)' }}>
              <div className="titleblock-main" style={{ borderRight: 'none', padding: '24px' }}>
                <div className="eyebrow">Organizer Portal</div>
                <h2 style={{ fontFamily: 'var(--mono)', margin: '0 0 8px', fontSize: '22px' }}>Admin Authentication</h2>
                <p style={{ fontSize: '13.5px', margin: 0 }}>Access reviewer queue and manage directory.</p>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', background: 'var(--white)', opacity: 1 }}>
              <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-field">
                  <label>Username</label>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Enter admin username"
                    autoComplete="off"
                  />
                </div>
                <div className="form-field">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>

                {adminError && (
                  <div style={{ color: 'var(--danger)', fontSize: '12.5px', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>
                    Incorrect username or password.
                  </div>
                )}

                <button type="submit" className="btn btn-solid btn-block" style={{ padding: '12px', cursor: 'pointer' }}>Sign In</button>
              </form>
            </div>
          </div>
        ) : (
          
          /* AUTHENTICATED DASHBOARD */
          <div style={{ maxWidth: '900px', margin: '40px auto 60px', padding: '0 24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1.5px solid var(--blue-deep)', paddingBottom: '14px', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', margin: 0 }}>Admin Portal</h1>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--amber-dim)', fontWeight: 'bold', marginTop: '4px' }}>
                  SECURED ACCESS ACTIVE
                </div>
              </div>
            </div>

            {actionMessage && (
              <div className={`msg-banner ${actionMessage.type === 'success' ? 'ok show' : 'error show'} mb-4`}>
                {actionMessage.text}
              </div>
            )}

            {/* Admin Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--paper-line)', paddingBottom: '8px' }}>
              <button
                className={`btn btn-sm ${adminTab === 'queue' ? 'btn-solid' : 'btn-ghost'}`}
                style={adminTab !== 'queue' ? { color: 'var(--blue-deep)', borderColor: 'var(--blue-deep)' } : {}}
                onClick={() => setAdminTab('queue')}
              >
                Review Queue ({pendingProjects.length})
              </button>
              <button
                className={`btn btn-sm ${adminTab === 'directory' ? 'btn-solid' : 'btn-ghost'}`}
                style={adminTab !== 'directory' ? { color: 'var(--blue-deep)', borderColor: 'var(--blue-deep)' } : {}}
                onClick={() => setAdminTab('directory')}
              >
                Active Directory ({allProjects.filter(p => p.status === 'active').length})
              </button>
            </div>

            {loading ? (
              <div className="empty-state text-center font-mono text-sm py-16 text-[#4a6178]">
                Fetching data from Supabase...
              </div>
            ) : (
              <>
                {/* TAB 1: REVIEW QUEUE */}
                {adminTab === 'queue' && (
                  <div>
                    <div className="results-count" style={{ marginBottom: '16px' }}>PENDING CALLS REQUIRING REVIEW</div>
                    {pendingProjects.length === 0 ? (
                      <div className="helper italic p-6 border border-dashed border-[#c9d6d1] bg-[var(--paper)] text-center">
                        No pending calls to review. The queue is empty!
                      </div>
                    ) : (
                      pendingProjects.map((p) => (
                        <div key={p.id} className="queue-card">
                          <div className="qtext">
                            <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--amber-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                              {p.caller_dept} &middot; Review Window: {p.review_days} days
                            </div>
                            <h3 style={{ fontSize: '16px', margin: '2px 0 6px 0', color: 'var(--blue-deep)', fontWeight: 'bold' }}>{p.title}</h3>
                            <p style={{ margin: '0 0 6px 0', color: 'var(--ink-soft)', fontSize: '13px' }}>{p.abstract}</p>
                            <div style={{ fontSize: '11.5px' }}>
                              Caller: <strong>{p.caller_name}</strong> &middot; Keywords: <span className="font-mono text-[11px] text-[#2563EB]">{p.keywords.join(', ')}</span>
                            </div>
                          </div>
                          <div className="queue-actions">
                            <button onClick={() => handleApprove(p.id)} className="btn btn-solid btn-sm" style={{ background: 'var(--ok)', borderColor: 'var(--ok)', color: '#fff' }}>
                              Approve
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 2: ACTIVE DIRECTORY */}
                {adminTab === 'directory' && (
                  <div>
                    <div className="results-count" style={{ marginBottom: '16px' }}>LIVE PROJECT CALLS</div>
                    {allProjects.filter(p => p.status === 'active').length === 0 ? (
                      <div className="helper italic p-6 border border-dashed border-[#c9d6d1] bg-[var(--paper)] text-center">
                        No active project calls in directory.
                      </div>
                    ) : (
                      <div className="card" style={{ padding: '20px', background: 'var(--white)', opacity: 1 }}>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1.5px solid var(--blue-deep)', fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                                <th style={{ padding: '8px 4px' }}>Title</th>
                                <th style={{ padding: '8px 4px' }}>Dept</th>
                                <th style={{ padding: '8px 4px' }}>Lead</th>
                                <th style={{ padding: '8px 4px' }}>Bookings</th>
                                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allProjects
                                .filter((p) => p.status === 'active')
                                .map((p) => {
                                  const confirmedCount = (p.applicants || []).filter(a => a.status === 'confirmed').length;
                                  return (
                                    <tr key={p.id} style={{ borderBottom: '1px dashed var(--paper-line)' }}>
                                      <td style={{ padding: '12px 4px', fontWeight: 'bold', color: 'var(--blue-deep)' }}>{p.title}</td>
                                      <td style={{ padding: '12px 4px' }}>{p.caller_dept}</td>
                                      <td style={{ padding: '12px 4px' }}>{p.caller_name}</td>
                                      <td style={{ padding: '12px 4px', fontFamily: 'var(--mono)' }}>{confirmedCount}/{p.slots_needed}</td>
                                      <td style={{ padding: '12px 4px', textAlign: 'right' }}>
                                        <button onClick={() => handleDelete(p.id)} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'inline-flex' }}>
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </div>

      <footer>
        PROJECTHUB PROTOTYPE — Admin secured route &middot; Next.js App Router &middot; Supabase Database
      </footer>
    </>
  );
}
