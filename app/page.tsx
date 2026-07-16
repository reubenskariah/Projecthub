'use client';

import React, { useState, useEffect } from 'react';
import ProjectForm from '@/components/ProjectForm';
import { fetchActiveProjects, reserveProjectSlot } from '@/app/actions/projectActions';
import { PRESET_KEYWORDS } from '@/lib/keywords';

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

const MENTORS = [
  { id: 1, name: "Dr. Menon", college: "College of Engineering", dept: "ECE", contact: "menon.ece@college.edu" },
  { id: 2, name: "Prof. Iyer", college: "College of Engineering", dept: "CSE", contact: "iyer.cse@college.edu" },
  { id: 3, name: "Dr. Suresh", college: "College of Engineering", dept: "ECE", contact: "suresh.ece@college.edu" },
  { id: 4, name: "Dr. Thomas", college: "Institute of Technology", dept: "IT", contact: "thomas.it@inst.edu" },
  { id: 5, name: "Prof. Das", college: "College of Engineering", dept: "CSE", contact: "das.cse@college.edu" },
  { id: 6, name: "Dr. Pillai", college: "College of Engineering", dept: "Civil", contact: "pillai.civil@college.edu" }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'mentors' | 'admin'>('feed');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [stats, setStats] = useState({ openCount: 0, newToday: 0 });

  // Modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Application form states
  const [applyName, setApplyName] = useState('');
  const [applySem, setApplySem] = useState('');
  const [applyDept, setApplyDept] = useState('CSE');
  const [applyLinkedin, setApplyLinkedin] = useState('');
  const [applyMessage, setApplyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submittingApply, setSubmittingApply] = useState(false);

  // Admin login states
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // Fetch active projects from the server action
  const loadProjects = async (kw?: string) => {
    setLoading(true);
    const res = await fetchActiveProjects(kw || undefined);
    if (res.success && res.data) {
      const fetchedProjects = res.data as Project[];
      setProjects(fetchedProjects);

      // Compute stats
      const activeCount = fetchedProjects.length;
      
      // Calculate "New Today" (inserted in the last 24h)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newTodayCount = fetchedProjects.filter((p) => new Date(p.created_at) >= oneDayAgo).length;

      setStats({
        openCount: activeCount,
        newToday: newTodayCount
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects(selectedKeyword || undefined);
  }, [selectedKeyword]);

  // Particle background canvas setup
  useEffect(() => {
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let clicks: any[] = [];
    let mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    const handleClick = (e: MouseEvent) => {
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 100,
        opacity: 0.6
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(111, 198, 217, 0.45)';
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 24000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animateCanvas = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(111, 198, 217, ${0.18 * (1 - dist / 100)})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.strokeStyle = `rgba(232, 163, 61, ${0.28 * (1 - dist / mouse.radius)})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      clicks.forEach((c, idx) => {
        c.radius += 3.5;
        c.opacity -= 0.016;

        ctx!.beginPath();
        ctx!.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(232, 163, 61, ${c.opacity})`;
        ctx!.lineWidth = 2;
        ctx!.stroke();

        if (c.opacity <= 0 || c.radius >= c.maxRadius) {
          clicks.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle Search Input & Keyword filtering
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim() === '') {
      setShowSuggestions(false);
      setSelectedKeyword(null);
    } else {
      // Filter keywords list
      const matches = PRESET_KEYWORDS.filter(kw =>
        kw.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    setSearchQuery(keyword);
    setSelectedKeyword(keyword);
    setShowSuggestions(false);
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setSelectedKeyword(null);
    setShowSuggestions(false);
  };

  // Helper to calculate days left of project review window
  const getDaysLeft = (expiresAtStr: string) => {
    const expiresAt = new Date(expiresAtStr);
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Determine indicator warning color
  const getGaugeClass = (daysLeft: number, windowDays: number) => {
    if (daysLeft <= 0) return 'danger';
    if (daysLeft / windowDays <= 0.34) return 'warn';
    return '';
  };

  // Filter projects client-side as well for title/abstract/caller matching
  const filteredProjects = projects.filter((p) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term || selectedKeyword === searchQuery) return true; // Already keyword-filtered by Supabase action
    
    return (
      p.title.toLowerCase().includes(term) ||
      p.abstract.toLowerCase().includes(term) ||
      p.caller_name.toLowerCase().includes(term) ||
      p.keywords.some((k) => k.toLowerCase().includes(term))
    );
  });

  // Handle slot reservation
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setApplyMessage(null);
    setSubmittingApply(true);

    try {
      const deptSemStr = `${applyDept}, Sem ${applySem}`;
      const res = await reserveProjectSlot(selectedProject.id, {
        name: applyName,
        dept_sem: deptSemStr,
        linkedin_url: applyLinkedin
      });

      if (res.success) {
        setApplyMessage({
          type: 'success',
          text: res.message || 'Slot reserved successfully!'
        });
        
        // Clear fields
        setApplyName('');
        setApplySem('');
        setApplyLinkedin('');

        // Reload the feed to update applicant list & counters
        const updated = await fetchActiveProjects(selectedKeyword || undefined);
        if (updated.success && updated.data) {
          const freshList = updated.data as Project[];
          setProjects(freshList);
          
          // Update the selected project in modal state as well
          const match = freshList.find((x) => x.id === selectedProject.id);
          if (match) {
            setSelectedProject(match);
          }
        }
      } else {
        setApplyMessage({
          type: 'error',
          text: res.error || 'Failed to apply.'
        });
      }
    } catch (err: any) {
      setApplyMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setSubmittingApply(false);
    }
  };

  // Handle Admin Auth (Mocked simple credentials)
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  return (
    <>
      {/* Background Canvas */}
      <canvas
        id="bgCanvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* Top Navbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand cursor-pointer" onClick={() => setActiveTab('feed')}>
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
          <nav className="nav-links">
            <button
              className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              Projects
            </button>
            <button
              className={`nav-tab ${activeTab === 'mentors' ? 'active' : ''}`}
              onClick={() => setActiveTab('mentors')}
            >
              Mentors
            </button>
            <button
              className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Portal
            </button>
          </nav>
          <nav className="top-actions">
            <button className="btn btn-amber cursor-pointer" onClick={() => setIsPostModalOpen(true)}>
              + Call for a project
            </button>
          </nav>
        </div>
      </header>

      {/* Main Pages */}

      {/* 1. Projects Directory Page */}
      {activeTab === 'feed' && (
        <div className="page-view active-view">
          <section className="hero" style={{ paddingTop: '24px' }}>
            <div className="hero-block border-[1.5px] border-[#0f2a47] bg-[#fbfdfb] grid grid-cols-1 md:grid-cols-2 shadow-[6px_6px_0_#0f2a47] rounded-sm overflow-hidden relative">
              
              {/* Hero Left Block */}
              <div className="hero-region-left p-8 flex flex-col justify-between min-h-[290px] gap-[14px]">
                <div className="flex items-start gap-[18px] text-left mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg style={{ width: '84px', height: 'auto', display: 'block' }} viewBox="20 20 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M45 40 L75 40" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                      <path d="M45 75 L75 75" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                      <path d="M45 40 L45 75" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                      <path 
                        d="M45 25 C75 25, 85 40, 85 50 C85 60, 75 70, 45 70" 
                        stroke="#2563EB" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        fill="none" 
                      />
                      <circle cx="45" cy="40" r="8" fill="#1E293B" />
                      <circle cx="75" cy="40" r="8" fill="#2563EB" />
                      <circle cx="45" cy="75" r="8" fill="#94A3B8" />
                      <circle cx="75" cy="75" r="5" fill="#38BDF8" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <h1 className="font-sans font-extrabold text-[72px] text-[#0f2a47] m-0 leading-[0.85] tracking-[-2.5px]">
                      project<span className="text-[#2563EB] font-black">hub</span>
                    </h1>
                    <div className="hero-quote font-sans text-sm tracking-[-0.1px] text-[#2563EB] font-bold uppercase pl-10 mt-[11px] leading-[1.1]">
                      you and your idea are not alone!
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-0 text-left pl-2 mb-2">
                  <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#c68227] font-bold mb-1.5">
                    Our Aim
                  </div>
                  <div className="font-sans text-[13.5px] text-[#0f2a47] leading-relaxed max-w-[460px] font-medium">
                    No student should have to build their vision alone. <span className="text-[#2563EB] font-bold">ProjectHub</span> ensures that great ideas always find their team. We bridge the gap between formation and collaboration. Through verified LinkedIn integrations, we simplify how campus teams unite.
                  </div>
                </div>

                <div className="flex justify-center w-full mt-auto pt-3">
                  <button onClick={() => setIsHowItWorksOpen(true)} className="btn btn-outline font-mono py-2.5 px-[22px] border-[1.5px] border-[#0f2a47] inline-flex items-center gap-2 font-bold cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="align-middle">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    How it works
                  </button>
                </div>
              </div>

              {/* Stats Right Block */}
              <div className="hero-region-right p-8 flex flex-col justify-center gap-4 border-l-2 border-dotted border-[#0f2a47] bg-[rgba(238,242,238,0.35)]">
                <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#c68227] mb-2 font-bold">
                  CAMPUS MATCH STATISTICS
                </div>

                <div className="hero-stat-box flex items-center gap-4 bg-[#fbfdfb] border-[1.5px] border-[#0f2a47] p-3 px-4 rounded-sm shadow-[3px_3px_0_rgba(15,42,71,0.15)]">
                  <div className="text-[28px] font-extrabold text-[#0f2a47] font-mono min-width-[48px]">
                    {loading ? '—' : stats.openCount}
                  </div>
                  <div className="text-xs text-[#4a6178] leading-tight">
                    <strong className="block text-[#0f2a47] font-mono uppercase text-[11px] mb-0.5">Active Projects</strong>
                    Open match calls looking for team members
                  </div>
                </div>

                <div className="hero-stat-box flex items-center gap-4 bg-[#fbfdfb] border-[1.5px] border-[#0f2a47] p-3 px-4 rounded-sm shadow-[3px_3px_0_rgba(15,42,71,0.15)]">
                  <div className="text-[28px] font-extrabold text-[#0f2a47] font-mono min-width-[48px]">
                    {MENTORS.length}
                  </div>
                  <div className="text-xs text-[#4a6178] leading-tight">
                    <strong className="block text-[#0f2a47] font-mono uppercase text-[11px] mb-0.5">Faculty Mentors</strong>
                    Guides ready to assist academic groups
                  </div>
                </div>

                <div className="hero-stat-box flex items-center gap-4 bg-[#fbfdfb] border-[1.5px] border-[#0f2a47] p-3 px-4 rounded-sm shadow-[3px_3px_0_rgba(15,42,71,0.15)]">
                  <div className="text-[28px] font-extrabold text-[#c68227] font-mono min-width-[48px]">
                    {loading ? '—' : stats.newToday}
                  </div>
                  <div className="text-xs text-[#4a6178] leading-tight">
                    <strong className="block text-[#c68227] font-mono uppercase text-[11px] mb-0.5">New Today</strong>
                    Submissions approved/added in last 24h
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search bar filter engine */}
          <div className="toolbar">
            <div className="search-row relative">
              <div className="search-wrap flex-1 flex relative">
                <input
                  type="text"
                  placeholder="Type keyword here... e.g. Machine Learning, VLSI Design, Web Development"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  autoComplete="off"
                  className="w-full"
                />
                
                {searchQuery && (
                  <button 
                    onClick={handleClearFilter}
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6178] hover:text-[#0f2a47] font-mono text-sm font-semibold"
                  >
                    CLEAR
                  </button>
                )}

                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown show">
                    {suggestions.map((match) => (
                      <div
                        key={match}
                        className="suggestion-item"
                        onClick={() => handleSelectKeyword(match)}
                      >
                        {match}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {selectedKeyword && (
              <div className="mt-2 text-xs font-mono text-[#0f2a47] flex items-center gap-2">
                <span>Active Filter: <strong>{selectedKeyword}</strong> (showing database exact matches)</span>
              </div>
            )}
            
            <div className="results-count mt-3 font-mono text-xs text-[#4a6178]">
              {loading ? 'Searching projects...' : `${filteredProjects.length} open call${filteredProjects.length === 1 ? '' : 's'}`}
            </div>
          </div>

          {/* Project Cards Grid */}
          {loading ? (
            <div className="empty-state text-center font-mono text-sm py-16 text-[#4a6178]">
              Loading project feed from database...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state text-center font-mono text-sm py-16 text-[#4a6178]">
              NO MATCHES IN RANGE — try clearing a filter or searching a different keyword.
            </div>
          ) : (
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1180px] mx-auto px-6 py-6 pb-16">
              {filteredProjects.map((p, idx) => {
                const applicants = p.applicants || [];
                const confirmedCount = applicants.filter((a) => a.status === 'confirmed').length;
                const remainingSlots = Math.max(0, p.slots_needed - confirmedCount);
                const daysLeft = getDaysLeft(p.expires_at);
                const pct = Math.max(4, Math.round((daysLeft / p.review_days) * 100));

                return (
                  <div key={p.id} className="card" style={{ animationDelay: `${idx * 40}ms` }}>
                    <div className="card-head">
                      <div className="card-dept">{p.caller_dept}</div>
                      <h3 className="card-title text-base font-bold leading-tight text-[#0f2a47]">{p.title}</h3>
                    </div>
                    <div className="card-body">
                      <div className="card-abstract text-xs text-[#4a6178] leading-relaxed line-clamp-3">{p.abstract}</div>
                      <div className="tag-row flex flex-wrap gap-1.5 mt-2">
                        {p.keywords.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="slot-row flex justify-between items-center text-xs mt-3">
                        <span className="font-mono">{remainingSlots === 0 ? 'Project full' : `${remainingSlots} open slot${remainingSlots === 1 ? '' : 's'} remaining`}</span>
                        <span className="slot-dots flex gap-1">
                          {Array.from({ length: p.slots_needed }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`dot w-2 h-2 rounded-full border border-[#0f2a47] ${i < confirmedCount ? 'bg-[#0f2a47] filled' : 'bg-transparent'}`} 
                            />
                          ))}
                        </span>
                      </div>

                      <div className="gauge-wrap mt-3">
                        <div className="gauge-label text-[10px] flex justify-between text-[#4a6178]">
                          <span>Review window</span>
                          <span>{daysLeft <= 0 ? 'closes today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}</span>
                        </div>
                        <div className="gauge h-2 bg-[#eef2ee] border border-[#c9d6d1] relative overflow-hidden">
                          <div
                            className={`gauge-fill h-full ${getGaugeClass(daysLeft, p.review_days) === 'danger' ? 'bg-[#c1502e]' : getGaugeClass(daysLeft, p.review_days) === 'warn' ? 'bg-[#e8a33d]' : 'bg-[#3f7d5c]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="card-foot flex justify-between items-center bg-[rgba(238,242,238,0.3)] border-t border-dashed border-[#c9d6d1] p-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-mono text-[#4a6178]">By: <strong>{p.caller_name}</strong></span>
                      </div>
                      <button onClick={() => {
                        setSelectedProject(p);
                        setApplyMessage(null);
                      }} className="btn btn-outline btn-sm font-semibold cursor-pointer">
                        View &amp; apply
                      </button>
                    </div>
                  </div>
                );
              })}
            </main>
          )}

          <footer>
            PROJECTHUB DIRECTORY — React &middot; Next.js Server Actions &middot; Supabase PostgreSQL View
          </footer>
        </div>
      )}

      {/* 2. Mentors Page */}
      {activeTab === 'mentors' && (
        <div className="page-view active-view">
          <section className="hero">
            <div className="titleblock border-[1.5px] border-[#0f2a47] bg-[#fbfdfb]">
              <div className="titleblock-main p-8 border-r border-[#0f2a47]">
                <div className="eyebrow font-mono text-xs text-[#c68227] tracking-wider uppercase mb-2">Expert Guidance &middot; Faculty Directory</div>
                <h1 className="text-3xl font-bold font-mono text-[#0f2a47]">Connect with Project Mentors</h1>
                <p className="text-sm text-[#4a6178] leading-relaxed mt-4">
                  Browse available faculty mentors across departments. Reach out to guide your project, review research proposals, or co-author technical publications.
                </p>
              </div>
              <div className="titleblock-meta p-8 flex flex-col justify-center gap-3">
                <div className="meta-row flex justify-between border-b border-dashed border-[#c9d6d1] pb-2 font-mono text-xs">
                  <span className="text-[#4a6178]">Total Mentors</span>
                  <span className="font-semibold text-[#0f2a47]">{MENTORS.length}</span>
                </div>
                <div className="meta-row flex justify-between border-b border-dashed border-[#c9d6d1] pb-2 font-mono text-xs">
                  <span className="text-[#4a6178]">Departments</span>
                  <span className="font-semibold text-[#0f2a47]">4 (CSE, ECE, IT, Civil)</span>
                </div>
                <div className="meta-row flex justify-between pb-1 font-mono text-xs">
                  <span className="text-[#4a6178]">Availability</span>
                  <span className="font-semibold text-[#0f2a47]">Academic Year 2026</span>
                </div>
              </div>
            </div>
          </section>

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1180px] mx-auto px-6 py-6 pb-16">
            {MENTORS.map((m, idx) => (
              <div key={m.id} className="card" style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="card-head">
                  <div className="card-dept text-xs font-mono text-[#c68227] uppercase tracking-wider">{m.dept} &middot; {m.college}</div>
                  <h3 className="card-title text-base font-bold text-[#0f2a47] mt-1">{m.name}</h3>
                </div>
                <div className="card-body p-4 flex flex-col flex-grow justify-between min-h-[140px]">
                  <p className="text-xs text-[#4a6178] leading-relaxed">
                    Available to guide research, review digital logic schematics, or evaluate embedded system hardware boards.
                  </p>
                  <div className="text-[11px] font-mono border-t border-dashed border-[#c9d6d1] pt-3 mt-4 text-[#0f2a47]">
                    Email: <strong>{m.contact}</strong>
                  </div>
                </div>
              </div>
            ))}
          </main>

          <footer>
            PROJECTHUB DIRECTORY — React &middot; Next.js Server Actions &middot; Supabase PostgreSQL View
          </footer>
        </div>
      )}

      {/* 3. Admin Portal Page */}
      {activeTab === 'admin' && (
        <div className="page-view active-view">
          {!isAdminLoggedIn ? (
            <div className="max-w-[450px] mx-auto my-16 px-4">
              <div className="titleblock border-[1.5px] border-[#0f2a47] bg-[#fbfdfb] rounded-sm mb-6">
                <div className="p-6">
                  <div className="eyebrow font-mono text-xs text-[#c68227] tracking-wider uppercase mb-1">Organizer Portal</div>
                  <h2 className="text-xl font-bold font-mono text-[#0f2a47]">Admin Authentication</h2>
                  <p className="text-xs text-[#4a6178] mt-1">Access reviewer queue and manage faculty mentors.</p>
                </div>
              </div>

              <div className="card p-6 bg-[#fbfdfb] border border-[#0f2a47] shadow-[6px_6px_0_#0f2a47]">
                <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-4">
                  <div className="form-field">
                    <label className="text-xs font-mono text-[#4a6178] uppercase font-bold">Username</label>
                    <input
                      type="text"
                      required
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="Enter admin username"
                      className="p-2.5 border border-[#c9d6d1] text-sm"
                    />
                  </div>
                  <div className="form-field">
                    <label className="text-xs font-mono text-[#4a6178] uppercase font-bold">Password</label>
                    <input
                      type="password"
                      required
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Enter admin password"
                      className="p-2.5 border border-[#c9d6d1] text-sm"
                    />
                  </div>

                  <div className="bg-[#eef2ee] border border-dashed border-[#c9d6d1] p-3 rounded-sm text-xs">
                    <strong className="color-[#c68227] font-mono block mb-1">Demo Credentials:</strong>
                    <span className="font-mono text-[#0f2a47]">User: <b>admin</b><br />Pass: <b>admin123</b></span>
                  </div>

                  {adminError && (
                    <div className="text-[#c1502e] text-xs font-mono font-bold">
                      Incorrect username or password.
                    </div>
                  )}

                  <button type="submit" className="btn btn-solid btn-block py-2.5 cursor-pointer">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-[900px] mx-auto my-12 px-6">
              <div className="flex justify-between items-center mb-6 border-b-[1.5px] border-[#0f2a47] pb-4">
                <div>
                  <h1 className="font-mono text-2xl font-bold text-[#0f2a47]">Admin Portal</h1>
                  <div className="font-mono text-[10px] text-[#c68227] font-bold mt-1">SECURED ACCESS ACTIVE</div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setAdminUser('');
                    setAdminPass('');
                  }}
                  className="btn btn-outline btn-sm font-semibold cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

              <div className="card p-6 bg-[#fbfdfb] border border-[#0f2a47] shadow-[6px_6px_0_#0f2a47]">
                <h3 className="font-mono text-base font-bold text-[#0f2a47] border-b border-dashed border-[#c9d6d1] pb-2 mb-4">
                  Review Queue & Directory Management
                </h3>
                <p className="text-sm text-[#4a6178]">
                  Database views and actions are fully connected. Spams and duplicate calls are reviewed automatically on live feed.
                </p>
                <div className="bg-[#eef2ee] border border-dashed border-[#c9d6d1] p-4 mt-6 text-xs text-[#0f2a47]">
                  <strong className="block font-mono text-[11px] mb-2 uppercase text-[#c68227]">Active System Status:</strong>
                  All server interactions are logged directly to the connected Supabase instance.
                </div>
              </div>
            </div>
          )}

          <footer>
            PROJECTHUB DIRECTORY — React &middot; Next.js Server Actions &middot; Supabase PostgreSQL View
          </footer>
        </div>
      )}

      {/* MODAL 1: Create Project Modal */}
      {isPostModalOpen && (
        <div className="overlay show" style={{ display: 'flex' }}>
          <div className="modal max-w-2xl w-full m-auto">
            <ProjectForm
              onSuccess={() => {
                // Reload feed when a project is submitted
                loadProjects(selectedKeyword || undefined);
              }}
              onClose={() => setIsPostModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MODAL 2: How It Works Modal */}
      {isHowItWorksOpen && (
        <div className="overlay show" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setIsHowItWorksOpen(false); }}>
          <div className="modal max-w-[580px] m-auto">
            <div className="modal-head">
              <div>
                <div className="card-dept">Platform Guide</div>
                <h2 className="text-lg font-bold font-mono">How ProjectHub Works</h2>
              </div>
              <button className="modal-close cursor-pointer" onClick={() => setIsHowItWorksOpen(false)}>✕</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4 items-start border-b border-dashed border-[#c9d6d1] pb-4">
                <div className="w-[120px] h-[90px] flex-shrink-0 bg-[#eef2ee] border border-[#0f2a47] flex items-center justify-center font-bold text-[#0f2a47]">
                  Step 1
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#0f2a47]">1. Post a Project Call</h3>
                  <p className="text-xs text-[#4a6178] leading-relaxed mt-1">
                    Enter project details, abstract, lead department and keyword tags. Set review days.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start border-b border-dashed border-[#c9d6d1] pb-4">
                <div className="w-[120px] h-[90px] flex-shrink-0 bg-[#eef2ee] border border-[#0f2a47] flex items-center justify-center font-bold text-[#0f2a47]">
                  Step 2
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#0f2a47]">2. Active Feed Listings</h3>
                  <p className="text-xs text-[#4a6178] leading-relaxed mt-1">
                    Calls are instantly pushed live, letting campus students browse and search matches.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-[120px] h-[90px] flex-shrink-0 bg-[#eef2ee] border border-[#0f2a47] flex items-center justify-center font-bold text-[#0f2a47]">
                  Step 3
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#0f2a47]">3. Professional Matchmaking</h3>
                  <p className="text-xs text-[#4a6178] leading-relaxed mt-1">
                    Students reserve slot reservations using valid LinkedIn URLs. First-come first-served criteria applies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Project Detail and Apply Modal */}
      {selectedProject && (
        <div className="overlay show" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}>
          <div className="modal max-w-[640px] m-auto">
            <div className="modal-head">
              <div>
                <div className="card-dept">{selectedProject.caller_dept}</div>
                <h2 className="text-lg font-bold font-mono">{selectedProject.title}</h2>
              </div>
              <button className="modal-close cursor-pointer" onClick={() => setSelectedProject(null)}>✕</button>
            </div>
            
            <div className="modal-body p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <div>
                <div className="modal-section-label">Abstract</div>
                <p className="text-sm text-[#0f2a47] leading-relaxed bg-[#eef2ee]/30 p-3 border border-[#c9d6d1] rounded-sm">
                  {selectedProject.abstract}
                </p>
              </div>

              <div className="bg-[#eef2ee] border border-[#c9d6d1] p-3 px-4 rounded-sm flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono text-[#4a6178] uppercase tracking-wider block">Project Called By</span>
                  <strong className="text-sm text-[#0f2a47]">{selectedProject.caller_name}</strong>
                </div>
                <div>
                  <span className="text-xs font-mono text-[#2563EB]">Project Creator</span>
                </div>
              </div>

              <div>
                <div className="modal-section-label">Review Window</div>
                {(() => {
                  const apps = selectedProject.applicants || [];
                  const confirmedCount = apps.filter(a => a.status === 'confirmed').length;
                  const daysLeft = getDaysLeft(selectedProject.expires_at);
                  const pct = Math.max(4, Math.round((daysLeft / selectedProject.review_days) * 100));
                  
                  return (
                    <div className="gauge-wrap border border-[#c9d6d1] p-3 bg-white">
                      <div className="gauge-label text-[10px] flex justify-between text-[#4a6178] font-bold">
                        <span>{confirmedCount}/{selectedProject.slots_needed} slots filled</span>
                        <span>{daysLeft <= 0 ? 'closes today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}</span>
                      </div>
                      <div className="gauge h-2 bg-[#eef2ee] border border-[#c9d6d1] mt-1 relative overflow-hidden">
                        <div
                          className={`gauge-fill h-full ${getGaugeClass(daysLeft, selectedProject.review_days) === 'danger' ? 'bg-[#c1502e]' : getGaugeClass(daysLeft, selectedProject.review_days) === 'warn' ? 'bg-[#e8a33d]' : 'bg-[#3f7d5c]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <div className="modal-section-label">Current Applicant Pool ({(selectedProject.applicants || []).length})</div>
                <div className="applicant-list flex flex-col gap-2">
                  {(selectedProject.applicants || []).length === 0 ? (
                    <div className="text-xs text-[#4a6178] italic p-2.5 bg-[#eef2ee] border border-[#c9d6d1] text-center">
                      No applicants yet — be the first to apply.
                    </div>
                  ) : (
                    (selectedProject.applicants || []).map((app, index) => (
                      <div key={index} className={`applicant flex justify-between items-center border border-[#c9d6d1] p-2.5 ${app.status === 'waitlist' ? 'opacity-75 bg-[#eef2ee] border-dashed' : 'bg-[#eef2ee]'}`}>
                        <div className="text-xs text-[#0f2a47] font-semibold">{app.name} &middot; {app.dept_sem}</div>
                        <div className="flex items-center gap-3">
                          <a href={app.linkedin_url.startsWith('http') ? app.linkedin_url : `https://${app.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#2563EB] hover:underline">
                            LinkedIn
                          </a>
                          <span className={`status-pill ${app.status === 'confirmed' ? 'main' : 'wait'}`}>
                            {app.status === 'confirmed' ? 'confirmed' : 'waitlist'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Join project form */}
              {(() => {
                const apps = selectedProject.applicants || [];
                const confirmedCount = apps.filter(a => a.status === 'confirmed').length;
                const totalCount = apps.length;
                const isFull = confirmedCount >= selectedProject.slots_needed;
                const isBufferLimit = totalCount >= (selectedProject.slots_needed * 2);

                if (isBufferLimit) {
                  return (
                    <div className="border-t border-[#c9d6d1] pt-4">
                      <div className="modal-section-label">Apply for a slot</div>
                      <div className="p-3.5 bg-red-50 text-[#c1502e] border border-[#c1502e] rounded-sm text-xs font-semibold text-center">
                        This project matches oversubscription limits. The waitlist buffer is completely full.
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="border-t border-[#c9d6d1] pt-4">
                    <div className="modal-section-label">{isFull ? 'Join the waitlist' : 'Apply for a slot'}</div>
                    
                    {applyMessage && (
                      <div className={`p-3 mb-3 border text-xs font-semibold rounded-sm ${applyMessage.type === 'success' ? 'bg-[#e4f3ea] border-[#3f7d5c] text-[#3f7d5c]' : 'bg-red-50 border-[#c1502e] text-[#c1502e]'}`}>
                        {applyMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleApplySubmit} className="apply-form flex flex-col gap-3">
                      <div className="form-row flex gap-3">
                        <div className="form-field flex-1 flex flex-col gap-1">
                          <label className="text-[10px] font-mono uppercase text-[#4a6178]">Name</label>
                          <input type="text" required value={applyName} onChange={(e) => setApplyName(e.target.value)} placeholder="e.g. Rahul P." className="p-2 border border-[#c9d6d1] text-xs" />
                        </div>
                        <div className="form-field flex-1 flex flex-col gap-1">
                          <label className="text-[10px] font-mono uppercase text-[#4a6178]">Semester</label>
                          <input type="text" required value={applySem} onChange={(e) => setApplySem(e.target.value)} placeholder="e.g. Sem 5" className="p-2 border border-[#c9d6d1] text-xs" />
                        </div>
                      </div>
                      <div className="form-row flex gap-3">
                        <div className="form-field flex-1 flex flex-col gap-1">
                          <label className="text-[10px] font-mono uppercase text-[#4a6178]">Department</label>
                          <select value={applyDept} onChange={(e) => setApplyDept(e.target.value)} className="p-2 border border-[#c9d6d1] text-xs">
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                        <div className="form-field flex-1 flex flex-col gap-1">
                          <label className="text-[10px] font-mono uppercase text-[#4a6178]">LinkedIn URL</label>
                          <input type="text" required value={applyLinkedin} onChange={(e) => setApplyLinkedin(e.target.value)} placeholder="e.g. linkedin.com/in/rahul-p" className="p-2 border border-[#c9d6d1] text-xs" />
                        </div>
                      </div>
                      <div className="helper text-[11px] text-[#4a6178] italic">
                        Once submitted, your slot status is confirmed instantly based on the current pool size.
                      </div>
                      <button
                        type="submit"
                        disabled={submittingApply}
                        className={`btn btn-block py-2.5 cursor-pointer font-bold ${isFull ? 'btn-outline border-[#0f2a47] text-[#0f2a47]' : 'btn-solid bg-[#0f2a47] text-white'}`}
                      >
                        {submittingApply ? 'Processing...' : isFull ? 'Join Waitlist' : 'Reserve My Slot'}
                      </button>
                    </form>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
