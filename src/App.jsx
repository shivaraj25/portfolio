const { useState, useEffect, useRef } = React;

// =============================================================================
// SHIVA RAJ PORTFOLIO - REACT APPLICATION
// =============================================================================

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Intro Video Player States
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:11');
  const [progressPercent, setProgressPercent] = useState(0);

  // Testimonials Data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager, TechNova",
      avatar: "assets/images/avatar_1.jpg",
      fallback: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      quote: "Shiva is an exceptional developer who delivers high-quality work on time. His attention to detail and problem-solving skills are top-notch."
    },
    {
      name: "Michael Chen",
      role: "CEO, DataFlow",
      avatar: "assets/images/avatar_2.jpg",
      fallback: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      quote: "Working with Shiva was a fantastic experience. He understood our requirements perfectly and built a product that exceeded our expectations."
    },
    {
      name: "Emily Rodriguez",
      role: "CTO, InnovateLab",
      avatar: "assets/images/avatar_3.jpg",
      fallback: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      quote: "His code quality, communication and dedication are outstanding. I highly recommend Shiva for any project requiring full-stack excellence."
    }
  ];

  // Trigger Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalData) {
        setModalData(null);
      }
    };
    if (modalData) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalData]);

  // ScrollSpy: Automatically highlight active section on scroll
  useEffect(() => {
    if (showIntro) return;
    const sections = ['home', 'about', 'skills', 'services', 'projects', 'experience', 'testimonials', 'contact'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showIntro]);

  // Switch from Intro Video to Portfolio Dashboard
  const enterPortfolio = () => {
    setIsIntroFading(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(() => {
      setShowIntro(false);
      setIsIntroFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("✨ Welcome to Shiva Raj's Portfolio Dashboard!");
    }, 550);
  };

  // Replay Intro Video from Dashboard
  const replayIntro = () => {
    setShowIntro(true);
    setIsIntroFading(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 100);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Video Event Handlers
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 11.85;
    setDuration(formatTime(dur));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 11.85;
    setCurrentTime(formatTime(curr));
    setDuration(formatTime(dur));
    setProgressPercent((curr / dur) * 100);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    enterPortfolio();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !videoRef.current.muted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    showToast(nextMute ? "🔇 Video audio muted" : "🔊 Video audio unmuted");
  };

  const handleTimelineClick = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * (videoRef.current.duration || 11.85);
    videoRef.current.currentTime = targetTime;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const cardEl = videoRef.current.closest('.video-ambient-card') || videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      cardEl.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Testimonial cycling
  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="portfolio-app-root">
      
      {/* 1. CINEMATIC VIDEO GATEWAY (Displayed before dashboard) */}
      {showIntro && (
        <aside className={`intro-gateway ${isIntroFading ? 'fade-out' : ''}`} aria-label="Intro Video Showcase">
          <div className="intro-ambient-glow glow-1"></div>
          <div className="intro-ambient-glow glow-2"></div>

          <div className="intro-container">
            {/* Top Bar */}
            <div className="intro-header">
              <div className="intro-brand">
                <div className="logo-badge">
                  <svg viewBox="0 0 40 40" className="hex-svg">
                    <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" className="hex-shape" />
                  </svg>
                  <span className="hex-letter">S</span>
                </div>
                <span className="brand-text">SHIVA <span className="gold-text">RAJ</span></span>
              </div>

              <div className="intro-badge-pill">
                <span className="pulse-dot"></span>
                <span>Introductory Video Showcase</span>
              </div>

              <button className="btn-skip" onClick={enterPortfolio} title="Jump into the portfolio dashboard">
                <span>Explore Dashboard</span>
                <svg viewBox="0 0 24 24" className="btn-icon-right"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Video Player Box */}
            <div className="intro-player-wrap">
              <div className="video-ambient-card">
                <video
                  ref={videoRef}
                  className="intro-video"
                  src="assets/video/intro.mp4"
                  playsInline
                  autoPlay
                  muted={isMuted}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onClick={togglePlay}
                />

                {/* Big Center Play Overlay Button */}
                {!isPlaying && (
                  <button className="big-play-btn" onClick={togglePlay} aria-label="Play Video">
                    <svg viewBox="0 0 24 24" className="play-svg"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
                  </button>
                )}

                {/* Quick Unmute pill if muted */}
                {isMuted && (
                  <div className="unmute-banner">
                    <button className="btn-unmute-pill" onClick={toggleMute}>
                      <svg viewBox="0 0 24 24" className="sound-svg"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      <span>Click to Unmute Audio</span>
                    </button>
                  </div>
                )}

                {/* Custom Video Controls Bar */}
                <div className="video-controls-overlay">
                  {/* Timeline Bar */}
                  <div className="timeline-bar-wrapper" onClick={handleTimelineClick}>
                    <div className="timeline-track">
                      <div className="timeline-buffered"></div>
                      <div className="timeline-progress" style={{ width: `${progressPercent}%` }}></div>
                      <div className="timeline-scrubber" style={{ left: `${progressPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="controls-actions">
                    <div className="controls-left">
                      <button className="ctrl-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? (
                          <svg viewBox="0 0 24 24" className="ctrl-svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="ctrl-svg"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
                        )}
                      </button>

                      <button className="ctrl-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? (
                          <svg viewBox="0 0 24 24" className="ctrl-svg"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="ctrl-svg"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        )}
                      </button>

                      <div className="time-display">
                        <span>{currentTime}</span>
                        <span className="time-divider">/</span>
                        <span>{duration}</span>
                      </div>
                    </div>

                    <div className="controls-right">
                      <span className="video-caption-label">Full HD • 60 FPS</span>
                      <button className="ctrl-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                        <svg viewBox="0 0 24 24" className="ctrl-svg"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA to Enter Dashboard */}
            <div className="intro-bottom-cta">
              <div className="intro-hint-text">
                <span>The portfolio will automatically open when this video ends, or click below:</span>
              </div>
              <button className="btn-primary-gold btn-large glow-gold-pulse" onClick={enterPortfolio}>
                <span>Enter Portfolio Dashboard</span>
                <svg viewBox="0 0 24 24" className="btn-icon-right"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. PORTFOLIO DASHBOARD */}
      <main className="portfolio-dashboard" aria-label="Main Portfolio Dashboard">
        {/* Ambient Lights */}
        <div className="ambient-glow bg-glow-hero"></div>
        <div className="ambient-glow bg-glow-projects"></div>
        <div className="ambient-glow bg-glow-contact"></div>

        {/* Site Header / Sticky Navbar */}
        <header className="site-header" id="navbar">
          <div className="header-inner">
            <a href="#home" className="brand-logo" onClick={() => setActiveSection('home')}>
              <div className="logo-badge">
                <svg viewBox="0 0 40 40" className="hex-svg">
                  <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" className="hex-shape" />
                </svg>
                <span className="hex-letter">S</span>
              </div>
              <span className="brand-text">SHIVA <span className="gold-text">RAJ</span></span>
            </a>

            <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              {['home', 'about', 'skills', 'services', 'projects', 'experience', 'testimonials', 'contact'].map((sec) => (
                <a
                  key={sec}
                  href={`#${sec}`}
                  className={`nav-item ${activeSection === sec ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(sec);
                    setMobileMenuOpen(false);
                  }}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </a>
              ))}
            </nav>

            {mobileMenuOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            <div className="nav-actions">
              <button className="btn-video-replay" onClick={replayIntro} title="Replay Introductory Video">
                <svg viewBox="0 0 24 24" className="btn-icon"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
                <span>Watch Video</span>
              </button>

              <a href="#contact" className="btn-primary-outline" onClick={() => setActiveSection('contact')}>
                <span>Let's Talk</span>
                <span className="rocket-emoji">🚀</span>
              </a>

              <button
                className="mobile-toggle-btn"
                aria-label="Toggle navigation"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="main-content-wrapper">

          {/* ================= HERO SECTION ================= */}
          <section id="home" className="hero-section">
            <div className="hero-grid">
              
              {/* Left Column */}
              <div className="hero-left">
                <div className="status-badge">
                  <span className="pulse-dot-green"></span>
                  <span className="status-text">Available for new opportunities</span>
                </div>

                <h1 className="hero-title">
                  I Build Modern<br />
                  <span className="gold-gradient-text">Web Experiences</span>
                </h1>

                <p className="hero-subtitle">
                  Full-stack developer crafting beautiful, fast and scalable digital products that solve real-world problems.
                </p>

                <div className="hero-cta-group">
                  <a href="#contact" className="btn-primary-gold" onClick={() => setActiveSection('contact')}>
                    <span>Hire Me</span>
                    <svg viewBox="0 0 24 24" className="btn-icon-right"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>

                  <a href="#projects" className="btn-dark-glass" onClick={() => setActiveSection('projects')}>
                    <span>View My Work</span>
                    <svg viewBox="0 0 24 24" className="btn-icon-right"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
                  </a>
                </div>

                {/* Social Icons */}
                <div className="hero-social-block">
                  <span className="social-label">Follow me on</span>
                  <div className="social-icons-row">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="social-circle" aria-label="GitHub" onClick={() => showToast("Opening GitHub profile...")}>
                      <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-circle" aria-label="LinkedIn" onClick={() => showToast("Opening LinkedIn profile...")}>
                      <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-circle" aria-label="Twitter / X" onClick={() => showToast("Opening X (Twitter) profile...")}>
                      <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-circle" aria-label="Instagram" onClick={() => showToast("Opening Instagram profile...")}>
                      <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/></svg>
                    </a>
                    <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="social-circle" aria-label="Dribbble" onClick={() => showToast("Opening Dribbble portfolio...")}>
                      <svg viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.129 10.742c-.443-.021-2.909-.115-5.632.748-.198-.445-.405-.892-.622-1.336 3.011-1.393 4.225-3.178 4.331-3.344 1.205 1.139 1.923 2.697 1.923 4.432zm-3.21-5.639c-.161.229-1.334 1.839-4.148 3.125-1.543-2.752-3.153-5.076-3.308-5.297.834-.239 1.716-.369 2.628-.369 1.782 0 3.424.582 4.828 1.541zm-9.014-1.895c.162.228 1.734 2.494 3.28 5.228-2.613.882-5.466 1.341-7.228 1.441.776-3.045 2.196-5.597 3.948-6.669zm-5.753 8.354c.038-.002.348-.016.892-.057 1.836-.135 4.981-.628 7.781-1.589.208.432.408.868.599 1.307-3.903 1.258-7.391 3.916-7.591 4.073-.787-1.077-1.281-2.368-1.281-3.734 0-.001 0-.002 0-.002zm1.884 5.374c.245-.183 3.327-2.433 7.027-3.666 1.127 2.923 1.637 5.642 1.724 6.136-1.597.525-3.306.812-5.076.812-1.34 0-2.617-.234-3.675-.682zm10.281 1.78c-.114-.582-.625-3.159-1.685-5.962 2.529-.861 4.857-.849 5.22-.843-.274 2.894-2.036 5.328-4.535 6.805z" fill="currentColor"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Portrait */}
              <div className="hero-right">
                <div className="hero-visual-card">
                  <div className="golden-halo-ring"></div>
                  
                  <div className="hero-image-wrapper">
                    <img src="assets/images/hero_portrait.jpg" alt="Shiva Raj - Full Stack Developer" className="hero-img" />
                  </div>

                  {/* Floating Stats Glass Pill */}
                  <div className="stats-glass-pill">
                    <div className="stat-col">
                      <div className="stat-num-row">
                        <span className="stat-num">5+</span>
                      </div>
                      <span className="stat-txt">Years Experience</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-col">
                      <div className="stat-num-row">
                        <span className="stat-num">30+</span>
                      </div>
                      <span className="stat-txt">Projects Completed</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-col">
                      <div className="stat-num-row">
                        <span className="stat-num">20+</span>
                      </div>
                      <span className="stat-txt">Happy Clients</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ================= 01 ABOUT ME & 02 SKILLS & STACK ================= */}
          <section className="section-container" id="about">
            <div className="bento-split-row">
              
              {/* Bento 01: About Me */}
              <div className="card-bento bento-about">
                <div className="card-index-tag">
                  <span className="tag-num">01</span>
                  <span className="tag-label">ABOUT ME</span>
                </div>

                <div className="about-content-grid">
                  <div className="about-photo-wrapper">
                    <img src="assets/images/about_img.jpg" alt="Shiva Raj Working" className="about-img" />
                    <div className="signature-tag">Shiva Raj</div>
                  </div>

                  <div className="about-info-col">
                    <h3 className="bento-heading">Building solutions with code & creativity.</h3>
                    <p className="bento-desc">
                      I'm a passionate Full-Stack Developer with 5+ years of experience building web applications and digital products. I love turning ideas into reality through clean code and user-centered design.
                    </p>

                    <div className="highlights-list">
                      <div className="highlight-item">
                        <div className="check-icon">
                          <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        </div>
                        <span>Problem solver by nature</span>
                      </div>
                      <div className="highlight-item">
                        <div className="check-icon">
                          <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        </div>
                        <span>Clean, scalable and maintainable code</span>
                      </div>
                      <div className="highlight-item">
                        <div className="check-icon">
                          <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        </div>
                        <span>Passionate about performance & UX</span>
                      </div>
                    </div>

                    <div className="about-actions">
                      <button
                        className="btn-dark-glass btn-sm"
                        onClick={() => {
                          setModalData({
                            title: "Curriculum Vitae - Shiva Raj",
                            badge: "Full-Stack Engineer & Architect",
                            content: (
                              <div style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#D1D5DB' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                  <strong>Experience:</strong> 5+ years crafting high-traffic SaaS, AI Healthcare, and E-commerce platforms.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                  <strong>Core Stack:</strong> React, Next.js, Node.js, TypeScript, Python, FastAPI, PostgreSQL, MongoDB, Docker, AWS.
                                </p>
                                <p style={{ marginBottom: '1.5rem' }}>
                                  <strong>Location:</strong> Araku, Andhra Pradesh, India (Available for Remote Worldwide).
                                </p>
                                <button
                                  className="btn-primary-gold btn-full"
                                  onClick={() => {
                                    showToast("📄 Downloading ShivaRaj_Resume_2026.pdf...");
                                    setModalData(null);
                                  }}
                                >
                                  Confirm Download PDF
                                </button>
                              </div>
                            )
                          });
                        }}
                      >
                        <span>Download CV</span>
                        <svg viewBox="0 0 24 24" className="btn-icon-right"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento 02: Skills & Stack */}
              <div className="card-bento bento-skills" id="skills">
                <div className="card-index-tag">
                  <span className="tag-num">02</span>
                  <span className="tag-label">SKILLS & STACK</span>
                </div>

                <div className="skills-grid">
                  {[
                    { name: "JavaScript", iconClass: "bg-js", label: "JS" },
                    { name: "TypeScript", iconClass: "bg-ts", label: "TS" },
                    { name: "React", iconType: "react" },
                    { name: "Next.js", iconClass: "bg-next", label: "N" },
                    { name: "Node.js", iconType: "node" },
                    { name: "HTML5", iconClass: "bg-html", label: "5" },
                    { name: "CSS3", iconClass: "bg-css", label: "3" },
                    { name: "Tailwind CSS", iconType: "tailwind" },
                    { name: "MongoDB", iconType: "mongo" },
                    { name: "PostgreSQL", iconType: "pg" },
                    { name: "Git", iconType: "git" },
                    { name: "Docker", iconType: "docker" },
                    { name: "AWS", iconClass: "bg-aws", label: "aws" },
                    { name: "Figma", iconType: "figma" },
                    { name: "GraphQL", iconType: "graphql" },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="skill-tile"
                      onClick={() => showToast(`⚡ ${skill.name}: Proficient in enterprise production applications`)}
                    >
                      {skill.label ? (
                        <div className={`skill-badge-icon ${skill.iconClass}`}>{skill.label}</div>
                      ) : (
                        <div className="skill-badge-icon">
                          {skill.iconType === 'react' && (
                            <svg viewBox="0 0 115.3 100"><ellipse cx="57.65" cy="50" rx="14.8" ry="46" transform="rotate(-60 57.65 50)" fill="none" stroke="#61dafb" strokeWidth="4.5"/><ellipse cx="57.65" cy="50" rx="14.8" ry="46" transform="rotate(60 57.65 50)" fill="none" stroke="#61dafb" strokeWidth="4.5"/><ellipse cx="57.65" cy="50" rx="14.8" ry="46" fill="none" stroke="#61dafb" strokeWidth="4.5"/><circle cx="57.65" cy="50" r="10.5" fill="#61dafb"/></svg>
                          )}
                          {skill.iconType === 'node' && (
                            <svg viewBox="0 0 32 32"><path d="M16 2.5L2.5 10.3v15.4L16 33.5l13.5-7.8V10.3L16 2.5zm0 3.7l9.7 5.6-9.7 5.6-9.7-5.6 9.7-5.6z" fill="#68a063"/></svg>
                          )}
                          {skill.iconType === 'tailwind' && (
                            <svg viewBox="0 0 24 24"><path d="M12 6c-2.4 0-3.9 1.2-4.5 3.6 1.05-.6 2.1-.75 3.15-.45.6.17 1.03.6 1.5 1.08C12.92 11.01 13.88 12 16.5 12c2.4 0 3.9-1.2 4.5-3.6-1.05.6-2.1.75-3.15.45-.6-.17-1.03-.6-1.5-1.08C15.58 6.99 14.62 6 12 6zm-7.5 6c-2.4 0-3.9 1.2-4.5 3.6 1.05-.6 2.1-.75 3.15-.45.6.17 1.03.6 1.5 1.08.77.78 1.73 1.77 4.35 1.77 2.4 0 3.9-1.2 4.5-3.6-1.05.6-2.1.75-3.15.45-.6-.17-1.03-.6-1.5-1.08C8.08 12.99 7.12 12 4.5 12z" fill="#38bdf8"/></svg>
                          )}
                          {skill.iconType === 'mongo' && (
                            <svg viewBox="0 0 24 24"><path d="M12 0s-5.8 4.6-5.8 11.3c0 4.2 2.6 8 5.8 10.7 3.2-2.7 5.8-6.5 5.8-10.7C17.8 4.6 12 0 12 0zm.6 18.7v-4.9c0-.3-.3-.6-.6-.6s-.6.3-.6.6v4.9c-2.2-2-3.8-4.7-3.8-7.4 0-4.3 3.5-7.7 4.4-8.8.9 1.1 4.4 4.5 4.4 8.8 0 2.7-1.6 5.4-3.8 7.4z" fill="#47a248"/></svg>
                          )}
                          {skill.iconType === 'pg' && (
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7-3.86-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V5.59C14.07 5.16 17.5 7.18 18.9 10c.7 1.41.97 3 .73 4.5-.24 1.5-.95 2.89-2.03 3.89z" fill="#336791"/></svg>
                          )}
                          {skill.iconType === 'git' && (
                            <svg viewBox="0 0 24 24"><path d="M21.6 10.9L13.1 2.4a2.2 2.2 0 0 0-3.1 0L8.2 4.2l3.4 3.4a2.6 2.6 0 0 1 3.3 3.3l3.3 3.3c.9-.5 2.2-.4 2.9.3.9.9.9 2.5 0 3.4s-2.5.9-3.4 0a2.4 2.4 0 0 1-.4-2.8l-3.1-3.1v6.7a2.5 2.5 0 1 1-2.2 0V9.4L4.2 13.6a2.2 2.2 0 0 0 0 3.1l8.5 8.5c.9.9 2.3.9 3.1 0l5.8-5.8c.8-.9.8-2.3 0-3.1z" fill="#f05032"/></svg>
                          )}
                          {skill.iconType === 'docker' && (
                            <svg viewBox="0 0 24 24"><path d="M13.9 8.2h2.2v2.2h-2.2zm-2.8 0h2.2v2.2h-2.2zm-2.8 0h2.2v2.2H8.3zm-2.8 0h2.2v2.2H5.5zm5.6-2.8h2.2v2.2h-2.2zm-2.8 0h2.2v2.2H8.3zm8.4 2.8h2.2v2.2h-2.2zm4.8 3.5c-.4-.3-1.6-.3-2.5.3-.2-.5-.6-1-1.2-1.3l-.6-.3-.3.6c-.4.8-.4 1.9.1 2.7-.8.5-2.2.6-3.8.6H2.1c-.5 0-.9.4-.9.9 0 2.5 1.5 5.5 4.3 7 2.1 1.1 4.7 1.3 6.9.7 4.1-1.1 6.8-4.4 7.6-8.7.6 0 1.2-.2 1.6-.6.5-.4.8-1 .6-1.5z" fill="#2496ed"/></svg>
                          )}
                          {skill.iconType === 'figma' && (
                            <svg viewBox="0 0 24 24"><path d="M8 2h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8V2zm0 8h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8v-8zm0 8h4a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-4-8a4 4 0 0 1 4-4H8v8H4a4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0-8a4 4 0 0 1 4-4H8v8H4a4 4 0 0 1-4-4 4 4 0 0 1 4-4z" fill="#f24e1e"/></svg>
                          )}
                          {skill.iconType === 'graphql' && (
                            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.31L4.85 8.44v7.12L12 19.69l7.15-4.13V8.44L12 4.31z" fill="#e10098"/></svg>
                          )}
                        </div>
                      )}
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>

                <div className="skills-footer-note">
                  <span className="heart-icon">💛</span>
                  <span>Always learning new technologies</span>
                </div>
              </div>

            </div>
          </section>

          {/* ================= 03 SERVICES ================= */}
          <section className="section-container" id="services">
            <div className="card-bento bento-services">
              <div className="card-index-tag">
                <span className="tag-num">03</span>
                <span className="tag-label">SERVICES</span>
              </div>

              <div className="services-grid">
                {[
                  {
                    id: "web",
                    title: "Web Development",
                    desc: "Building responsive, performant and modern websites & web applications.",
                    icon: (
                      <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 9l-2 2 2 2M16 9l2 2-2 2M13 8l-2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    ),
                    details: "End-to-end full stack web applications with React 18, Next.js 14, Node.js, and TypeScript. Optimized for responsiveness, clean maintainable code, SEO, and lightning fast load times."
                  },
                  {
                    id: "design",
                    title: "UI/UX Design",
                    desc: "Designing intuitive and beautiful interfaces that provide exceptional user experiences.",
                    icon: (
                      <svg viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                    ),
                    details: "Design systems, interactive prototypes in Figma, accessible interfaces (WCAG 2.1 compliant), micro-interactions, dark/light themes, and conversion-centered digital aesthetics."
                  },
                  {
                    id: "api",
                    title: "API Development",
                    desc: "Building robust, scalable and secure APIs to power your digital products.",
                    icon: (
                      <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                    ),
                    details: "RESTful and GraphQL backend architecture with Node.js, Express, Fastify, and PostgreSQL/MongoDB. Features include JWT authentication, OAuth2, rate limiting, and Stripe/PayPal integrations."
                  },
                  {
                    id: "perf",
                    title: "Performance Optimization",
                    desc: "Improving speed, SEO and overall performance for better user experience.",
                    icon: (
                      <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
                    ),
                    details: "Auditing Core Web Vitals, code splitting, image optimization, edge caching, CDN acceleration, database index tuning, and achieving 95+ Google Lighthouse scores."
                  }
                ].map((srv) => (
                  <div
                    key={srv.id}
                    className="service-card"
                    onClick={() => {
                      setModalData({
                        title: srv.title,
                        badge: "Service Capability",
                        content: (
                          <div style={{ color: '#D1D5DB', lineHeight: 1.7 }}>
                            <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>{srv.desc}</p>
                            <div style={{ background: 'rgba(229, 169, 60, 0.08)', border: '1px solid rgba(229, 169, 60, 0.25)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                              <h5 style={{ color: '#E5A93C', marginBottom: '0.5rem', fontWeight: 700 }}>What is included:</h5>
                              <p style={{ fontSize: '0.9rem' }}>{srv.details}</p>
                            </div>
                            <a
                              href="#contact"
                              className="btn-primary-gold btn-full"
                              onClick={() => {
                                setModalData(null);
                                setActiveSection('contact');
                              }}
                            >
                              Inquire About This Service 🚀
                            </a>
                          </div>
                        )
                      });
                    }}
                  >
                    <div className="service-icon-box">{srv.icon}</div>
                    <h4 className="service-title">{srv.title}</h4>
                    <p className="service-desc">{srv.desc}</p>
                    <div className="service-link">
                      <span>Learn more</span>
                      <svg viewBox="0 0 24 24" className="arrow-svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 04 FEATURED PROJECTS ================= */}
          <section className="section-container" id="projects">
            <div className="card-bento bento-projects">
              
              <div className="projects-header-row">
                <div className="card-index-tag">
                  <span className="tag-num">04</span>
                  <span className="tag-label">FEATURED PROJECTS</span>
                </div>

                <a
                  href="#projects"
                  className="view-all-link"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("📂 Showing all completed production projects in archive");
                  }}
                >
                  <span>View all projects</span>
                  <svg viewBox="0 0 24 24" className="arrow-svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </a>
              </div>

              <div className="projects-grid">
                {[
                  {
                    id: "aarogyadrishti",
                    title: "AarogyaDrishti (aarogyadrishti.in)",
                    tags: ["AI / ML", "React", "Python", "FastAPI"],
                    image: "assets/images/proj_aarogyadrishti.jpg",
                    desc: "AI-powered health platform featuring a Comorbidity Risk Prediction Engine & clinical health assessment.",
                    metrics: "Evaluates multi-condition health risk using demographic vitals, clinical checkups, and lifestyle history.",
                    url: "https://aarogyadrishti.in"
                  },
                  {
                    id: "analytics",
                    title: "Analytics Dashboard",
                    tags: ["React", "Node.js", "MongoDB"],
                    image: "assets/images/proj_analytics.jpg",
                    desc: "Real-time analytics dashboard with interactive charts and advanced filtering.",
                    metrics: "Handled 1.2M events/day, reduced latency by 45%, real-time WebSockets."
                  },
                  {
                    id: "saas",
                    title: "SaaS Landing Page",
                    tags: ["Next.js", "TypeScript", "Tailwind"],
                    image: "assets/images/proj_saas.jpg",
                    desc: "Modern and conversion-focused landing page for a SaaS product.",
                    metrics: "Achieved a 34% increase in user signups with responsive dark theme."
                  },
                  {
                    id: "ecommerce",
                    title: "E-commerce Platform",
                    tags: ["Next.js", "Stripe", "MongoDB"],
                    image: "assets/images/proj_ecommerce.jpg",
                    desc: "Full-featured e-commerce platform with payment integration and admin panel.",
                    metrics: "Processed $450K+ in GMV with instant Stripe webhook settlement."
                  }
                ].map((proj) => (
                  <div
                    key={proj.id}
                    className="project-card"
                    onClick={() => {
                      setModalData({
                        title: proj.title,
                        badge: proj.tags.join(" • "),
                        content: (
                          <div style={{ color: '#D1D5DB', lineHeight: 1.7 }}>
                            <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <img src={proj.image} alt={proj.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                            <p style={{ marginBottom: '1rem', fontSize: '0.98rem' }}>{proj.desc}</p>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
                              <strong style={{ color: '#E5A93C' }}>Impact & Results:</strong> {proj.metrics}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button
                                className="btn-primary-gold"
                                style={{ flex: 1 }}
                                onClick={() => {
                                  if (proj.url) {
                                    window.open(proj.url, '_blank', 'noopener,noreferrer');
                                  } else {
                                    showToast(`🚀 Launching live preview for ${proj.title}...`);
                                  }
                                }}
                              >
                                {proj.url ? "Visit Live Site ↗" : "View Live Demo ↗"}
                              </button>
                              <button
                                className="btn-dark-glass"
                                style={{ flex: 1 }}
                                onClick={() => showToast(`💻 Opening GitHub source repository for ${proj.title}...`)}
                              >
                                Source Code ⊞
                              </button>
                            </div>
                          </div>
                        )
                      });
                    }}
                  >
                    <div className="project-thumb-box">
                      <img src={proj.image} alt={proj.title} className="proj-img" />
                      <div className="proj-overlay">
                        <span
                          className="proj-view-btn"
                          onClick={(e) => {
                            if (proj.url) {
                              e.stopPropagation();
                              window.open(proj.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          {proj.url ? "Visit aarogyadrishti.in ↗" : "View Live Demo ↗"}
                        </span>
                      </div>
                    </div>
                    <div className="project-body">
                      <div className="project-tags">
                        {proj.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            <span className="proj-tag">{t}</span>
                            {idx < proj.tags.length - 1 && <span className="dot">•</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="project-title-row">
                        <h4 className="project-title">{proj.title}</h4>
                        <div
                          className="ext-link-icon"
                          title={proj.url ? "Open live site" : "View details"}
                          onClick={(e) => {
                            if (proj.url) {
                              e.stopPropagation();
                              window.open(proj.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        </div>
                      </div>
                      <p className="project-desc">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 05 EXPERIENCE ================= */}
          <section className="section-container" id="experience">
            <div className="card-bento bento-experience">
              <div className="card-index-tag">
                <span className="tag-num">05</span>
                <span className="tag-label">EXPERIENCE</span>
              </div>

              <div className="timeline-container">
                <div className="timeline-golden-track"></div>

                <div className="timeline-steps">
                  {[
                    {
                      title: "Senior Developer",
                      company: "TechNova Solutions",
                      period: "2022 - Present",
                      desc: "Leading development of SaaS products and managing a team of developers.",
                      active: true
                    },
                    {
                      title: "Full Stack Developer",
                      company: "CodeCraft Labs",
                      period: "2020 - 2022",
                      desc: "Built and maintained multiple client projects using MERN stack."
                    },
                    {
                      title: "Frontend Developer",
                      company: "Webify Digital",
                      period: "2019 - 2020",
                      desc: "Developed responsive websites and web apps using modern frameworks."
                    },
                    {
                      title: "Junior Developer",
                      company: "Pixel Perfect Studio",
                      period: "2017 - 2019",
                      desc: "Collaborated on projects and gained foundational development skills."
                    }
                  ].map((exp, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="step-indicator">
                        <div className={`step-icon-circle ${exp.active ? 'active-current' : ''}`}>
                          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></svg>
                        </div>
                        <div className="timeline-dot"></div>
                      </div>
                      <div className="step-card">
                        <h4 className="exp-title">{exp.title}</h4>
                        <div className="exp-meta">
                          <span className="exp-company">{exp.company}</span>
                          <span className="exp-period">{exp.period}</span>
                        </div>
                        <p className="exp-desc">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= 06 TESTIMONIALS ================= */}
          <section className="section-container" id="testimonials">
            <div className="card-bento bento-testimonials">
              
              <div className="testimonials-header-row">
                <div className="card-index-tag">
                  <span className="tag-num">06</span>
                  <span className="tag-label">TESTIMONIALS</span>
                </div>

                {/* Carousel Controls */}
                <div className="testimonials-arrows">
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginRight: '0.5rem' }}>
                    {testimonialIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    className="arrow-btn"
                    onClick={prevTestimonial}
                    aria-label="Previous Testimonial"
                  >
                    <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    className="arrow-btn"
                    onClick={nextTestimonial}
                    aria-label="Next Testimonial"
                  >
                    <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              {/* Active Testimonial Card */}
              <div className="testimonials-grid">
                {testimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className={`testimonial-card ${idx === testimonialIndex ? 'active-testi-card' : ''}`}
                    style={{
                      borderColor: idx === testimonialIndex ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                      boxShadow: idx === testimonialIndex ? '0 0 20px rgba(229,169,60,0.15)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setTestimonialIndex(idx)}
                  >
                    <div className="quote-mark">“</div>
                    <p className="testimonial-quote">{item.quote}</p>
                    <div className="testimonial-author-row">
                      <div className="author-avatar-wrap">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="author-avatar"
                          onError={(e) => { e.currentTarget.src = item.fallback; }}
                        />
                      </div>
                      <div className="author-details">
                        <h5 className="author-name">{item.name}</h5>
                        <span className="author-role">{item.role}</span>
                      </div>
                      <div className="star-rating">★★★★★</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 07 GET IN TOUCH ================= */}
          <section className="section-container" id="contact">
            <div className="card-bento bento-contact">
              <div className="card-index-tag">
                <span className="tag-num">07</span>
                <span className="tag-label">GET IN TOUCH</span>
              </div>

              <div className="contact-grid">
                
                {/* Left Info */}
                <div className="contact-info-col">
                  <h2 className="contact-headline">
                    Let's build something<br />
                    <span className="gold-gradient-text">amazing</span> together.
                  </h2>
                  <p className="contact-subtext">
                    Have a project in mind or want to say hello? I'd love to hear from you.
                  </p>

                  <div className="contact-meta-list">
                    <div className="meta-row">
                      <div className="meta-icon-box">
                        <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </div>
                      <div className="meta-text" style={{ flex: 1 }}>
                        <span className="meta-label">Email</span>
                        <a href="mailto:shivarajchedda23@gmail.com" className="meta-val">shivarajchedda23@gmail.com</a>
                      </div>
                      <button
                        type="button"
                        className="ctrl-btn"
                        title="Copy email to clipboard"
                        onClick={() => {
                          navigator.clipboard.writeText('shivarajchedda23@gmail.com');
                          showToast("📋 Email copied: shivarajchedda23@gmail.com");
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="ctrl-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </button>
                    </div>

                    <div className="meta-row">
                      <div className="meta-icon-box">
                        <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </div>
                      <div className="meta-text" style={{ flex: 1 }}>
                        <span className="meta-label">Phone</span>
                        <a href="tel:+918332086212" className="meta-val">+91 8332086212</a>
                      </div>
                      <button
                        type="button"
                        className="ctrl-btn"
                        title="Copy phone to clipboard"
                        onClick={() => {
                          navigator.clipboard.writeText('+918332086212');
                          showToast("📋 Phone copied: +91 8332086212");
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="ctrl-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </button>
                    </div>

                    <div className="meta-row">
                      <div className="meta-icon-box">
                        <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </div>
                      <div className="meta-text">
                        <span className="meta-label">Location</span>
                        <span className="meta-val">Araku, Andhra Pradesh, India</span>
                      </div>
                    </div>

                    <div className="meta-row">
                      <div className="meta-icon-box">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      </div>
                      <div className="meta-text">
                        <span className="meta-label">Availability</span>
                        <span className="meta-val">Available for Global & Remote Work (IST)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Controlled Form */}
                <div className="contact-form-col">
                  <ContactForm onSubmitSuccess={() => showToast("🚀 Message sent successfully! Shiva Raj will reply shortly.")} />
                </div>

              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-left">
                <div className="logo-badge">
                  <svg viewBox="0 0 40 40" className="hex-svg">
                    <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" className="hex-shape" />
                  </svg>
                  <span className="hex-letter">S</span>
                </div>
                <span className="brand-text">SHIVA <span className="gold-text">RAJ</span></span>
              </div>

              <div className="footer-center">
                <span>© 2024 Shiva Raj. All rights reserved.</span>
              </div>

              <div className="footer-right">
                <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast("🔒 Privacy Policy: Encrypted & privacy compliant."); }}>Privacy Policy</a>
                <span className="footer-divider">•</span>
                <a href="#terms" onClick={(e) => { e.preventDefault(); showToast("⚖ Terms: All rights reserved."); }}>Terms of Service</a>
                
                <button
                  className="btn-top"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  title="Back to top"
                >
                  <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </footer>

        </div>
      </main>

      {/* 3. MODAL COMPONENT */}
      {modalData && (
        <div className="modal-backdrop active" onClick={() => setModalData(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalData(null)}>&times;</button>
            <div className="modal-content">
              {modalData.badge && (
                <div className="status-badge" style={{ marginBottom: '1rem' }}>
                  <span className="status-text">{modalData.badge}</span>
                </div>
              )}
              <h3 className="bento-heading" style={{ marginBottom: '1rem' }}>{modalData.title}</h3>
              {modalData.content}
            </div>
          </div>
        </div>
      )}

      {/* 4. TOAST NOTIFICATION COMPONENT */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast-pill">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}

// Interactive React Form Component
function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onSubmitSuccess();
    }, 1000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row-two">
        <div className="form-group">
          <label htmlFor="user-name">Your Name</label>
          <input
            type="text"
            id="user-name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="user-email">Your Email</label>
          <input
            type="email"
            id="user-email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="user-subject">Subject</label>
        <input
          type="text"
          id="user-subject"
          required
          placeholder="Project Inquiry / Collaboration"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="user-message">Your Message</label>
        <textarea
          id="user-message"
          rows="4"
          required
          placeholder="Tell me about your project goals and timeline..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        ></textarea>
      </div>

      <button type="submit" className="btn-primary-gold btn-full" disabled={isSending}>
        <span>{isSending ? "Sending..." : "Send Message"}</span>
        <span className="rocket-emoji">🚀</span>
      </button>
    </form>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
