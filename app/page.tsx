'use client';

import React, { useState, useEffect } from 'react';
import ProjectForm from '@/components/ProjectForm';
import { fetchActiveProjects, reserveProjectSlot, fetchMentors } from '@/app/actions/projectActions';
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

interface Mentor {
  id: string;
  name: string;
  college: string;
  dept: string;
  contact: string;
}

const DEFAULT_MENTORS: Mentor[] = [
  { id: "1", name: "Dr. Menon", college: "College of Engineering", dept: "ECE", contact: "menon.ece@college.edu" },
  { id: "2", name: "Prof. Iyer", college: "College of Engineering", dept: "CSE", contact: "iyer.cse@college.edu" },
  { id: "3", name: "Dr. Suresh", college: "College of Engineering", dept: "ECE", contact: "suresh.ece@college.edu" },
  { id: "4", name: "Dr. Thomas", college: "Institute of Technology", dept: "ECS", contact: "thomas.it@inst.edu" },
  { id: "5", name: "Prof. Das", college: "College of Engineering", dept: "CSE", contact: "das.cse@college.edu" },
  { id: "6", name: "Dr. Pillai", college: "College of Engineering", dept: "CE", contact: "pillai.civil@college.edu" }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'mentors'>('feed');
  const [projects, setProjects] = useState<Project[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>(DEFAULT_MENTORS);
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

  const loadMentors = async () => {
    const res = await fetchMentors();
    if (res.success && res.data) {
      setMentors(res.data as Mentor[]);
    } else if (res.isTableMissing) {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('ph_mentors');
        if (local) {
          setMentors(JSON.parse(local));
        } else {
          setMentors(DEFAULT_MENTORS);
          localStorage.setItem('ph_mentors', JSON.stringify(DEFAULT_MENTORS));
        }
      }
    }
  };

  useEffect(() => {
    loadProjects(selectedKeyword || undefined);
    loadMentors();
  }, [selectedKeyword]);

  useEffect(() => {
    if (activeTab === 'mentors') {
      loadMentors();
    }
  }, [activeTab]);


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

    // CRITICAL: Suggest only after at least 2 characters are typed
    if (val.trim().length >= 2) {
      const matches = PRESET_KEYWORDS.filter(kw =>
        kw.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 10); // Show max 10 suggestions
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedKeyword(null);
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
            <div className="hero-block">
              
              {/* Region 1: Left Side */}
              <div className="hero-region-left">
                
                {/* Top content block (Logo Icon and Logo Name + Quote) */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', width: '100%', textAlign: 'left', marginBottom: '12px' }}>
                  {/* Left: Logo Icon SVG (Enlarged) */}
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <svg style={{ width: 'clamp(60px, 12vw, 84px)', height: 'auto', display: 'block' }} viewBox="20 20 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  
                  {/* Right: Logo Name and Quote */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                    {/* Logo Name (Bigger size, aligned left, close to icon) */}
                    <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 'clamp(36px, 8vw, 72px)', color: '#0f2a47', margin: 0, lineHeight: 0.85, letterSpacing: '-2.5px' }}>
                      project<span style={{ color: '#2563EB', fontWeight: 900 }}>hub</span>
                    </h1>
                    
                    {/* Quote (Placed below name with a gap, color matching logo blue, uppercase, no quotes, sans font, shifted 0.3cm down and aligned below the 'r') */}
                    <div className="hero-quote" style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(11px, 2.5vw, 14px)', letterSpacing: '-0.1px', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase', paddingLeft: 'clamp(10px, 6vw, 40px)', marginTop: '11px', lineHeight: 1.1 }}>
                      you and your idea are not alone!
                    </div>
                  </div>
                </div>

                {/* Bottom text block (Aligned to the starting edge of the logo icon) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', textAlign: 'left', paddingLeft: 'clamp(0px, 2vw, 8px)', marginBottom: '8px' }}>
                  {/* Heading: Our Aim */}
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--amber-dim)', fontWeight: 700, marginBottom: '6px' }}>
                    Our Aim
                  </div>
                  
                  {/* Subtitle sentence (matching logo deep blue color) */}
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13.5px', color: '#0f2a47', lineHeight: 1.5, maxWidth: '460px', fontWeight: 500 }}>
                    No student should have to build their vision alone. <span style={{ color: '#2563EB', fontWeight: 700 }}>ProjectHub</span> ensures that great ideas always find their team. We bridge the gap between imagination and execution by simplifying how teams form on campus. Through quick slot-reservations and professional LinkedIn integration, we help you build your future, together.
                  </div>
                </div>

                {/* How It Works Guideline Click Box (Box 3 - Centered closer to the bottom) */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto', paddingTop: '14px' }}>
                  <button onClick={() => setIsHowItWorksOpen(true)} className="btn btn-outline" style={{ fontFamily: 'var(--mono)', padding: '11px 22px', border: '1.5px solid var(--blue-deep)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    How it works
                  </button>
                </div>
              </div>

              {/* Region 2: Right Side with dotted boundary */}
              <div className="hero-region-right">
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--amber-dim)', marginBottom: '8px', fontWeight: 700 }}>
                  CAMPUS MATCH STATISTICS
                </div>

                <div className="hero-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--white)', border: '1.5px solid var(--blue-deep)', padding: '12px 16px', borderRadius: 'var(--radius)', boxShadow: '3px 3px 0 rgba(15,42,71,0.15)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue-deep)', fontFamily: 'var(--mono)', minWidth: '48px' }}>
                    {loading ? '—' : stats.openCount}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.35 }}>
                    <strong style={{ display: 'block', color: 'var(--blue-deep)', fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: '11px' }}>Active Projects</strong>
                    Open match calls looking for team members
                  </div>
                </div>

                <div className="hero-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--white)', border: '1.5px solid var(--blue-deep)', padding: '12px 16px', borderRadius: 'var(--radius)', boxShadow: '3px 3px 0 rgba(15,42,71,0.15)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue-deep)', fontFamily: 'var(--mono)', minWidth: '48px' }}>
                    {mentors.length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.35 }}>
                    <strong style={{ display: 'block', color: 'var(--blue-deep)', fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: '11px' }}>Faculty Mentors</strong>
                    Guides ready to assist academic groups
                  </div>
                </div>

                <div className="hero-stat-box" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--white)', border: '1.5px solid var(--blue-deep)', padding: '12px 16px', borderRadius: 'var(--radius)', boxShadow: '3px 3px 0 rgba(15,42,71,0.15)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--amber-dim)', fontFamily: 'var(--mono)', minWidth: '48px' }}>
                    {loading ? '—' : stats.newToday}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.35 }}>
                    <strong style={{ display: 'block', color: 'var(--amber-dim)', fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: '11px' }}>New Today</strong>
                    Submissions approved in last 24h
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
            <main className="grid">
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
                      <h3 className="card-title">{p.title}</h3>
                    </div>
                    <div className="card-body">
                      <div className="card-abstract">{p.abstract}</div>
                      <div className="tag-row mt-2">
                        {p.keywords.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="slot-row text-xs mt-3">
                        <span>{remainingSlots === 0 ? 'Project full' : `${remainingSlots} open slot${remainingSlots === 1 ? '' : 's'} remaining`}</span>
                        <span className="slot-dots">
                          {Array.from({ length: p.slots_needed }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`dot ${i < confirmedCount ? 'filled' : ''}`} 
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

                    <div className="card-foot">
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
            PROJECTHUB PROTOTYPE — Next.js &middot; Supabase &middot; Vercel
          </footer>
        </div>
      )}

      {/* 2. Mentors Page */}
      {activeTab === 'mentors' && (
        <div className="page-view active-view">
          <section className="hero">
            <div className="titleblock">
              <div className="titleblock-main">
                <div className="eyebrow">Expert Guidance &middot; Faculty Directory</div>
                <h1>Connect with Project Mentors</h1>
                <p>
                  Browse available faculty mentors across departments. Reach out to guide your project, review research proposals, or co-author technical publications.
                </p>
              </div>
              <div className="titleblock-meta">
                <div className="meta-row">
                  <span>Total Mentors</span>
                  <span>{mentors.length}</span>
                </div>
                <div className="meta-row">
                  <span>Departments</span>
                  <span>4 (CSE, ECE, IT, Civil)</span>
                </div>
                <div className="meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span>Availability</span>
                  <span>Academic Year 2026</span>
                </div>
              </div>
            </div>
          </section>

          <main className="grid">
            {mentors.map((m, idx) => (
              <div key={m.id} className="card" style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="card-head">
                  <div className="card-dept">{m.dept} &middot; {m.college}</div>
                  <h3 className="card-title">{m.name}</h3>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
                    Available to guide research, review digital logic schematics, or evaluate embedded system hardware boards.
                  </p>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px dashed var(--paper-line)' }}>
                    Email: <strong>{m.contact}</strong>
                  </div>
                </div>
              </div>
            ))}
          </main>

          <footer>
            PROJECTHUB PROTOTYPE — Next.js &middot; Supabase &middot; Vercel
          </footer>
        </div>
      )}

      {/* MODAL 1: Create Project Modal */}
      {isPostModalOpen && (
        <div className="overlay show" style={{ display: 'flex' }}>
          <div className="modal max-w-2xl w-full m-auto">
            <ProjectForm
              onSuccess={() => {
                // Reload feed (though it'll be pending, so it won't appear immediately, which is correct)
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
                <h2>How ProjectHub Works</h2>
              </div>
              <button className="modal-close cursor-pointer" onClick={() => setIsHowItWorksOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="flex gap-4 items-start border-b border-dashed border-[#c9d6d1] pb-4">
                <img
                  src="/how_it_works_1.png"
                  style={{ width: '120px', height: '90px', objectFit: 'cover', border: '1.5px solid var(--blue-deep)', background: 'var(--paper)' }}
                  alt="Step 1"
                  className="flex-shrink-0"
                />
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--mono)', fontSize: '14.5px', color: 'var(--blue-deep)' }}>Create and Submit a Project Call</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    Click the "+ Call for a project" button. Enter your name, lead department, title, abstract, and mail id. Select up to 10 keyword tags and set a review window from 1 to 14 days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-b border-dashed border-[#c9d6d1] pb-4">
                <img
                  src="/how_it_works_2.png"
                  style={{ width: '120px', height: '90px', objectFit: 'cover', border: '1.5px solid var(--blue-deep)', background: 'var(--paper)' }}
                  alt="Step 2"
                  className="flex-shrink-0"
                />
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--mono)', fontSize: '14.5px', color: 'var(--blue-deep)' }}>Spam Verification & Live Feed</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    To maintain directory quality, new project calls enter a review queue. Once approved by an administrator, your listing immediately goes live and appears at the top of the page feed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-b border-dashed border-[#c9d6d1] pb-4">
                <img
                  src="/how_it_works_3.png"
                  style={{ width: '120px', height: '90px', objectFit: 'cover', border: '1.5px solid var(--blue-deep)', background: 'var(--paper)' }}
                  alt="Step 3"
                  className="flex-shrink-0"
                />
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--mono)', fontSize: '14.5px', color: 'var(--blue-deep)' }}>Team Match & Slot Reservations</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    Students browse listings and click "View & Apply" to reserve open slots by entering their details and LinkedIn profile URL. If the target slots are full, students can join the waitlist buffer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src="/how_it_works_4.png"
                  style={{ width: '120px', height: '90px', objectFit: 'cover', border: '1.5px solid var(--blue-deep)', background: 'var(--paper)' }}
                  alt="Step 4"
                  className="flex-shrink-0"
                />
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--mono)', fontSize: '14.5px', color: 'var(--blue-deep)' }}>Closing</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    When your review window expires, the project automatically closes and disappears from the public feed. A report listing the names, semesters, and direct LinkedIn profile links of all applicants is instantly emailed to your email address.
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
                <h2>{selectedProject.title}</h2>
              </div>
              <button className="modal-close cursor-pointer" onClick={() => setSelectedProject(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div>
                <div className="modal-section-label">Abstract</div>
                <p>{selectedProject.abstract}</p>
              </div>

              <div style={{ background: 'var(--paper)', border: '1px solid var(--paper-line)', padding: '12px 16px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '2px' }}>Project Called By</span>
                  <strong style={{ fontSize: '15px', color: 'var(--blue-deep)' }}>{selectedProject.caller_name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--blue-mid)', fontWeight: 'bold' }}>PROJECT CREATOR</span>
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
                    <div className="gauge-wrap">
                      <div className="gauge-label font-bold">
                        <span>{confirmedCount}/{selectedProject.slots_needed} slots filled</span>
                        <span>{daysLeft <= 0 ? 'closes today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}</span>
                      </div>
                      <div className="gauge mt-1">
                        <div
                          className={`gauge-fill ${getGaugeClass(daysLeft, selectedProject.review_days)}`}
                          style={{ width: `${pct}%` }}
                        />
                        <div className="gauge-ticks" />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <div className="modal-section-label">Current Applicant Pool ({(selectedProject.applicants || []).length})</div>
                <div className="applicant-list">
                  {(selectedProject.applicants || []).length === 0 ? (
                    <div className="helper italic text-center p-3 border border-dashed border-[#c9d6d1] bg-[var(--paper)]">
                      No applicants yet — be the first to apply.
                    </div>
                  ) : (
                    (selectedProject.applicants || []).map((app, index) => (
                      <div key={index} className={`applicant ${app.status === 'waitlist' ? 'waitlist' : ''}`}>
                        <span>{app.name} &middot; {app.dept_sem}</span>
                        <span className="flex items-center gap-2">
                          <a href={app.linkedin_url.startsWith('http') ? app.linkedin_url : `https://${app.linkedin_url}`} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                          <span className={`status-pill ${app.status === 'confirmed' ? 'main' : 'wait'}`}>
                            {app.status === 'confirmed' ? 'confirmed' : 'waitlist'}
                          </span>
                        </span>
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
                  <div className="border-t border-dashed border-[#c9d6d1] pt-4">
                    <div className="modal-section-label">{isFull ? 'Join the waitlist' : 'Apply for a slot'}</div>
                    
                    {applyMessage && (
                      <div className={`msg-banner ${applyMessage.type === 'success' ? 'ok show' : 'error show'} mb-3`}>
                        {applyMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleApplySubmit} className="apply-form">
                      <div className="form-row">
                        <div className="form-field">
                          <label>Name</label>
                          <input type="text" required value={applyName} onChange={(e) => setApplyName(e.target.value)} placeholder="e.g. Rahul P." />
                        </div>
                        <div className="form-field">
                          <label>Semester</label>
                          <input type="text" required value={applySem} onChange={(e) => setApplySem(e.target.value)} placeholder="e.g. Sem 5" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Department</label>
                          <select value={applyDept} onChange={(e) => setApplyDept(e.target.value)}>
                            <option value="ECE">ECE</option>
                            <option value="CSE">CSE</option>
                            <option value="CE">CE</option>
                            <option value="ME">ME</option>
                            <option value="CHE">CHE</option>
                            <option value="FT">FT</option>
                            <option value="EV">EV</option>
                            <option value="ECS">ECS</option>
                            <option value="RB">RB</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label>LinkedIn URL</label>
                          <input type="text" required value={applyLinkedin} onChange={(e) => setApplyLinkedin(e.target.value)} placeholder="e.g. linkedin.com/in/rahul-p" />
                        </div>
                      </div>
                      <div className="helper italic">
                        Once submitted, your slot status is confirmed instantly based on the current pool size.
                      </div>
                      <button
                        type="submit"
                        disabled={submittingApply}
                        className={`btn btn-block ${isFull ? 'btn-outline border-[#0f2a47] text-[#0f2a47]' : 'btn-solid bg-[#0f2a47] text-white'}`}
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
